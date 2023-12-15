import { autocomplete } from '@algolia/autocomplete-js';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js/dist/instantsearch.production.min';

declare global {
  interface Window {
    algoliasearch: typeof algoliasearch;
    instantsearch: typeof instantsearch;
    '@algolia/autocomplete-js': {
      autocomplete: typeof autocomplete;
    };
    '@algolia/autocomplete-plugin-recent-searches': {
      createLocalStorageRecentSearchesPlugin: typeof createLocalStorageRecentSearchesPlugin;
    };
    '@algolia/autocomplete-plugin-query-suggestions': {
      createQuerySuggestionsPlugin: typeof createQuerySuggestionsPlugin;
    };
  }
}
