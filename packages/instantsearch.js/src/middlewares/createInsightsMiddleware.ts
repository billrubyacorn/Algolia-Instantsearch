import { getInsightsAnonymousUserTokenInternal } from '../helpers';
import {
  warning,
  noop,
  getAppIdAndApiKey,
  find,
  safelyRunOnBrowser,
} from '../lib/utils';

import type {
  InsightsClient,
  InsightsClientMethod,
  InternalMiddleware,
  Hit,
} from '../types';
import type {
  AlgoliaSearchHelper,
  PlainSearchParameters,
} from 'algoliasearch-helper';

export type InsightsEvent = {
  insightsMethod?: InsightsClientMethod;
  payload: any;
  widgetType: string;
  eventType: string; // 'view' | 'click' | 'conversion', but we're not restricting.
  hits?: Hit[];
  attribute?: string;
};

export type InsightsProps<
  TInsightsClient extends InsightsClient | null | undefined =
    | InsightsClient
    | null
    | undefined
> = {
  insightsClient?: TInsightsClient;
  insightsInitParams?: {
    userHasOptedOut?: boolean;
    useCookie?: boolean;
    cookieDuration?: number;
    region?: 'de' | 'us';
  };
  onEvent?: (event: InsightsEvent, insightsClient: TInsightsClient) => void;
};

const ALGOLIA_INSIGHTS_SRC =
  'https://cdn.jsdelivr.net/npm/search-insights@2.3.0/dist/search-insights.min.js';

export type CreateInsightsMiddleware = typeof createInsightsMiddleware;

export function createInsightsMiddleware<
  TInsightsClient extends null | InsightsClient
>(props: InsightsProps<TInsightsClient> = {}): InternalMiddleware {
  const {
    insightsClient: _insightsClient,
    insightsInitParams,
    onEvent,
  } = props;

  let insightsClient: InsightsClient = _insightsClient || noop;

  let needsToLoadInsightsClient = false;
  if (_insightsClient !== null && !_insightsClient) {
    safelyRunOnBrowser(({ window }: { window: any }) => {
      const pointer = window.AlgoliaAnalyticsObject || 'aa';

      if (typeof pointer === 'string') {
        insightsClient = window[pointer];
      }

      if (!insightsClient) {
        window.AlgoliaAnalyticsObject = pointer;
        if (!window[pointer]) {
          window[pointer] = (...args: any[]) => {
            if (!window[pointer].queue) {
              window[pointer].queue = [];
            }
            window[pointer].queue.push(args);
          };
        }

        insightsClient = window[pointer];
        needsToLoadInsightsClient = true;
      }
    });
  }

  return ({ instantSearchInstance }) => {
    const [appId, apiKey] = getAppIdAndApiKey(instantSearchInstance.client);

    // search-insights.js also throws an error so dev-only clarification is sufficient
    warning(
      Boolean(appId && apiKey),
      'could not extract Algolia credentials from searchClient in insights middleware.'
    );

    let queuedUserToken: string | undefined = undefined;
    let userTokenBeforeInit: string | undefined = undefined;

    if (Array.isArray(insightsClient.queue)) {
      // Context: The umd build of search-insights is asynchronously loaded by the snippet.
      //
      // When user calls `aa('setUserToken', 'my-user-token')` before `search-insights` is loaded,
      // ['setUserToken', 'my-user-token'] gets stored in `aa.queue`.
      // Whenever `search-insights` is finally loaded, it will process the queue.
      //
      // But here's the reason why we handle it here:
      // At this point, even though `search-insights` is not loaded yet,
      // we still want to read the token from the queue.
      // Otherwise, the first search call will be fired without the token.
      [, queuedUserToken] =
        find(
          insightsClient.queue.slice().reverse(),
          ([method]) => method === 'setUserToken'
        ) || [];
    }
    insightsClient('getUserToken', null, (_error: any, userToken: string) => {
      // If user has called `aa('setUserToken', 'my-user-token')` before creating
      // the `insights` middleware, we store them temporarily and
      // set it later on.
      //
      // Otherwise, the `init` call might override it with anonymous user token.
      userTokenBeforeInit = userToken;
    });
    insightsClient('init', {
      appId,
      apiKey,
      useCookie: true,
      ...insightsInitParams,
    });

    let initialParameters: PlainSearchParameters;
    let helper: AlgoliaSearchHelper;

    return {
      onStateChange() {},
      subscribe() {
        if (!needsToLoadInsightsClient) return;

        const errorMessage =
          '[insights middleware]: could not load search-insights.js. Please load it manually following https://alg.li/insights-init';

        try {
          const script = document.createElement('script');
          script.async = true;
          script.src = ALGOLIA_INSIGHTS_SRC;
          script.onerror = () => {
            instantSearchInstance.emit('error', new Error(errorMessage));
          };
          document.body.appendChild(script);
        } catch (cause) {
          instantSearchInstance.emit('error', new Error(errorMessage));
        }
      },
      started() {
        insightsClient('addAlgoliaAgent', 'insights-middleware');

        helper = instantSearchInstance.helper!;

        initialParameters = {
          userToken: (helper.state as PlainSearchParameters).userToken,
          clickAnalytics: helper.state.clickAnalytics,
        };

        helper.overrideStateWithoutTriggeringChangeEvent({
          ...helper.state,
          clickAnalytics: true,
        });
        instantSearchInstance.scheduleSearch();

        const setUserTokenToSearch = (userToken?: string) => {
          helper.overrideStateWithoutTriggeringChangeEvent({
            ...helper.state,
            userToken,
          });

          instantSearchInstance.scheduleSearch();
        };

        const anonymousUserToken = getInsightsAnonymousUserTokenInternal();
        if (anonymousUserToken) {
          // When `aa('init', { ... })` is called, it creates an anonymous user token in cookie.
          // We can set it as userToken.
          setUserTokenToSearch(anonymousUserToken);
        }

        // We consider the `userToken` coming from a `init` call to have a higher
        // importance than the one coming from the queue.
        if (userTokenBeforeInit) {
          insightsClient('setUserToken', userTokenBeforeInit);
        } else if (queuedUserToken) {
          insightsClient('setUserToken', queuedUserToken);
        }

        // This updates userToken which is set explicitly by `aa('setUserToken', userToken)`
        insightsClient('onUserTokenChange', setUserTokenToSearch, {
          immediate: true,
        });

        instantSearchInstance.sendEventToInsights = (event: InsightsEvent) => {
          if (onEvent) {
            onEvent(event, _insightsClient as TInsightsClient);
          } else if (event.insightsMethod) {
            insightsClient(event.insightsMethod, event.payload);

            warning(
              Boolean((helper.state as PlainSearchParameters).userToken),
              `
Cannot send event to Algolia Insights because \`userToken\` is not set.

See documentation: https://www.algolia.com/doc/guides/building-search-ui/going-further/send-insights-events/js/#setting-the-usertoken
`
            );
          } else {
            warning(
              false,
              'Cannot send event to Algolia Insights because `insightsMethod` option is missing.'
            );
          }
        };
      },
      unsubscribe() {
        insightsClient('onUserTokenChange', undefined);
        instantSearchInstance.sendEventToInsights = noop;
        if (helper && initialParameters) {
          helper.setState({
            ...helper.state,
            ...initialParameters,
          });

          instantSearchInstance.scheduleSearch();
        }
      },
    };
  };
}
