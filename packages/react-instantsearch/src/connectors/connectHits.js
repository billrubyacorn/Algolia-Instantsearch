import createConnector from '../core/createConnector';

/**
 * connectHits connector provides the logic to create connected
 * components that will render the results retrieved from
 * Algolia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](/widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](/connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * parameter to the [searchParameters](/guide/Search%20parameters.html) prop on `<InstantSearch/>`.
 * @name connectHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 */
export default createConnector({
  displayName: 'AlgoliaHits',

  getProvidedProps(props, state, search) {
    if (!search.results) {
      return null;
    }

    return {
      hits: search.results.hits,
    };
  },
});
