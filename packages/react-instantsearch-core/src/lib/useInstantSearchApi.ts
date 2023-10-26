import InstantSearch from 'instantsearch.js/es/lib/InstantSearch';
import { useCallback, useRef, version as ReactVersion } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import version from '../version';

import { useForceUpdate } from './useForceUpdate';
import { useInstantSearchServerContext } from './useInstantSearchServerContext';
import { useInstantSearchSSRContext } from './useInstantSearchSSRContext';
import { useRSCContext } from './useRSCContext';
import { warn } from './warn';

import type {
  InstantSearchOptions,
  SearchClient,
  UiState,
} from 'instantsearch.js';

const defaultUserAgents = [
  `react (${ReactVersion})`,
  `react-instantsearch (${version})`,
  `react-instantsearch-core (${version})`,
];
const serverUserAgent = `react-instantsearch-server (${version})`;
const nextUserAgent = (nextVersion?: string) =>
  nextVersion ? `next.js (${nextVersion})` : null;

export type UseInstantSearchApiProps<
  TUiState extends UiState,
  TRouteState
> = InstantSearchOptions<TUiState, TRouteState>;

export type InternalInstantSearch<
  TUiState extends UiState,
  TRouteState = TUiState
> = InstantSearch<TUiState, TRouteState> & {
  /**
   * Schedule a function to be called on the next timer tick
   * @private
   */
  _schedule: {
    (cb: () => void): void;
    queue: Array<() => void>;
    timer: ReturnType<typeof setTimeout> | undefined;
  };
  /**
   * Used inside useWidget, which ensures that removeWidgets is not called.
   * This prevents a search from being triggered when InstantSearch is also unmounted.
   * @private
   */
  _preventWidgetCleanup?: boolean;
};

export function useInstantSearchApi<TUiState extends UiState, TRouteState>(
  props: UseInstantSearchApiProps<TUiState, TRouteState>
) {
  const forceUpdate = useForceUpdate();
  const serverContext = useInstantSearchServerContext<TUiState, TRouteState>();
  const serverState = useInstantSearchSSRContext<TUiState, TRouteState>();
  const waitingForResultsRef = useRSCContext();
  const initialResults = serverState?.initialResults;

  const shouldRenderAtOnce =
    serverContext || initialResults || waitingForResultsRef;

  let searchRef = useRef<InternalInstantSearch<TUiState, TRouteState> | null>(
    null
  );
  // As we need to render on mount with SSR, using the local ref above in `StrictMode` will
  // create and start two instances of InstantSearch. To avoid this, we instead discard it and use
  // an upward ref from `InstantSearchSSRContext` as it has already been mounted a second time at this point.
  if (serverState) {
    searchRef = serverState.ssrSearchRef;
  }

  if (searchRef.current === null) {
    // We don't use the `instantsearch()` function because it comes with other
    // top-level APIs that we don't need.
    // See https://github.com/algolia/instantsearch/blob/5b529f43d8acc680f85837eaaa41f7fd03a3f833/src/index.es.ts#L63-L86
    const search = new InstantSearch(props) as InternalInstantSearch<
      TUiState,
      TRouteState
    >;

    search._schedule = function _schedule(cb: () => void) {
      search._schedule.queue.push(cb);

      clearTimeout(search._schedule.timer);
      search._schedule.timer = setTimeout(() => {
        search._schedule.queue.forEach((callback) => {
          callback();
        });
        search._schedule.queue = [];
      }, 0);
    } as typeof search._schedule;
    search._schedule.queue = [];

    if (shouldRenderAtOnce) {
      // InstantSearch.js has a private Initial Results API that lets us inject
      // results on the search instance.
      // On the server, we default the initial results to an empty object so that
      // InstantSearch.js doesn't schedule a search that isn't used, leading to
      // an additional network request. (This is equivalent to monkey-patching
      // `scheduleSearch` to a noop.)
      search._initialResults = initialResults || {};
    }

    addAlgoliaAgents(props.searchClient, [
      ...defaultUserAgents,
      serverContext && serverUserAgent,
      nextUserAgent(getNextVersion()),
    ]);

    // On the server, we start the search early to compute the search parameters.
    // On SSR, we start the search early to directly catch up with the lifecycle
    // and render.
    if (shouldRenderAtOnce) {
      search.start();
    }

    if (serverContext) {
      // We notify `getServerState()` of the InstantSearch internals to retrieve
      // the server state and pass it to the render on SSR.
      serverContext.notifyServer({ search });
    }

    warnNextRouter(props.routing);
    warnNextAppDir(Boolean(waitingForResultsRef));

    searchRef.current = search;
  }

  searchRef.current.update(props);

  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const store = useSyncExternalStore<InstantSearch<TUiState, TRouteState>>(
    useCallback(() => {
      const search = searchRef.current!;

      // Scenario 1: the component mounts.
      if (cleanupTimerRef.current === null) {
        // On SSR, the instance is already started so we don't start it again.
        if (!search.started) {
          search.start();
          forceUpdate();
        }
      }
      // Scenario 2: the component updates.
      else {
        // We cancel the previous cleanup function because we don't want to
        // dispose the search during an update.
        clearTimeout(cleanupTimerRef.current);
        search._preventWidgetCleanup = false;
      }

      return () => {
        function cleanup() {
          search.dispose();
        }

        clearTimeout(search._schedule.timer);
        // We clean up only when the component that uses this subscription unmounts,
        // but not when it updates, because it would dispose the instance, which
        // would remove all the widgets and break routing.
        // Executing the cleanup function in a `setTimeout()` lets us cancel it
        // in the next effect.
        // (There might be better ways to do this.)
        cleanupTimerRef.current = setTimeout(cleanup);

        // We need to prevent the `useWidget` cleanup function so that widgets
        // are not removed before the instance is disposed, triggering
        // an unwanted search request.
        search._preventWidgetCleanup = true;
      };
    }, [forceUpdate]),
    () => searchRef.current!,
    () => searchRef.current!
  );

  return store;
}

function addAlgoliaAgents(
  searchClient: SearchClient,
  userAgents: Array<string | null>
) {
  if (typeof searchClient.addAlgoliaAgent !== 'function') {
    return;
  }

  userAgents.filter(Boolean).forEach((userAgent) => {
    searchClient.addAlgoliaAgent!(userAgent!);
  });
}

function warnNextRouter<TUiState extends UiState, TRouteState>(
  routing: UseInstantSearchApiProps<TUiState, TRouteState>['routing']
) {
  if (__DEV__) {
    if (
      !routing ||
      typeof window === 'undefined' ||
      !('__NEXT_DATA__' in window)
    ) {
      return;
    }

    const isUsingNextRouter =
      // @ts-expect-error: _isNextRouter is only set on the Next.js router
      routing !== true && routing?.router?._isNextRouter;

    warn(
      isUsingNextRouter,
      `
You are using Next.js with InstantSearch without the "react-instantsearch-router-nextjs" package.
This package is recommended to make the routing work correctly with Next.js.
Please check its usage instructions: https://github.com/algolia/instantsearch/tree/master/packages/react-instantsearch-router-nextjs

You can ignore this warning if you are using a custom router that suits your needs, it won't be outputted in production builds.`
    );
  }
}

function warnNextAppDir(isRscContextDefined: boolean) {
  if (!__DEV__ || typeof window === 'undefined' || isRscContextDefined) {
    return;
  }

  warn(
    Boolean((window as any).next?.appDir) === false,
    `
We've detected you are using Next.js with the App Router.
We released an **experimental** package called "react-instantsearch-nextjs" that makes SSR work with the App Router.
Please check its usage instructions: https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/#with-nextjs

This warning will not be outputted in production builds.`
  );
}

/**
 * Gets the version of Next.js if it is available in the `window` object,
 * otherwise it returns the NEXT_RUNTIME environment variable (in SSR),
 * which is either `nodejs` or `edge`.
 */
function getNextVersion() {
  return (
    (typeof window !== 'undefined' &&
      ((window as any).next?.version as string | undefined)) ||
    (typeof process !== 'undefined' ? process.env?.NEXT_RUNTIME : undefined)
  );
}
