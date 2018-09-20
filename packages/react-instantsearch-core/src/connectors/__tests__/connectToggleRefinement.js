import { SearchParameters, SearchResults } from 'algoliasearch-helper';
import connect from '../connectToggleRefinement';

jest.mock('../../core/createConnector', () => x => x);

const createSearchResults = ({ disjunctiveFacets, facets }) =>
  new SearchResults(
    new SearchParameters({
      disjunctiveFacets,
    }),
    [
      {
        facets,
        hits: [
          { objectID: '0123', name: 'Apple' },
          { objectID: '0123', name: 'Samsung' },
          { objectID: '0123', name: 'Microsoft' },
        ],
      },
    ]
  );

describe('connectToggleRefinement', () => {
  describe('single index', () => {
    const context = { context: { ais: { mainTargetedIndex: 'index' } } };
    const getProvidedProps = connect.getProvidedProps.bind(context);
    const refine = connect.refine.bind(context);
    const getSP = connect.getSearchParameters.bind(context);
    const getMetadata = connect.getMetadata.bind(context);
    const cleanUp = connect.cleanUp.bind(context);

    const createSingleIndexSearchResults = (...args) => ({
      results: createSearchResults(...args),
    });

    it('expect `currentRefinement` to be `true` when the value is checked', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = { toggle: { shipping: true } };
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(true);
    });

    it('expect `currentRefinement` to be `false` when the value is not checked', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(false);
    });

    it('expect `currentRefinement` to be `defaultRefinement`', () => {
      const props = {
        defaultRefinement: true,
        attribute: 'shipping',
        value: true,
      };
      const searchState = {};
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(true);
    });

    it('expect `canRefine` to be `true` with results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = createSingleIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 100,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(true);
    });

    it('expect `canRefine` to be `false` with a value count of 0', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = createSingleIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 0,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `canRefine` to be `false` without the facet', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = createSingleIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {},
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `canRefine` to be `false` without results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `count` to match facet values with results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = createSingleIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 100,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: 150,
        unchecked: 100,
      });
    });

    it('expect `count` to be null without the facet', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = createSingleIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {},
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: null,
        unchecked: null,
      });
    });

    it('expect `count` to be null without results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = {};
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: null,
        unchecked: null,
      });
    });

    it("calling refine updates the widget's search state", () => {
      let searchState = refine(
        { attribute: 't' },
        { otherKey: 'val', toggle: { otherKey: false } },
        true
      );
      expect(searchState).toEqual({
        otherKey: 'val',
        page: 1,
        toggle: { t: true, otherKey: false },
      });

      searchState = refine({ attribute: 't' }, { otherKey: 'val' }, false);
      expect(searchState).toEqual({
        page: 1,
        otherKey: 'val',
        toggle: { t: false },
      });
    });

    it('refines the corresponding facet with `true`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          value: 'val',
        },
        {
          toggle: {
            facet: true,
          },
        }
      );

      expect(params.getDisjunctiveRefinements('facet')).toEqual(['val']);
    });

    it('does not refine the corresponding facet with `false`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          value: 'val',
        },
        {
          toggle: {
            facet: false,
          },
        }
      );

      expect(params.getDisjunctiveRefinements('facet')).toEqual([]);
    });

    it('applies the provided filter with `true`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          filter: sp => sp.setQuery('yep'),
        },
        {
          toggle: {
            facet: true,
          },
        }
      );

      expect(params.query).toEqual('yep');
    });

    it('does not apply the provided filter with `false`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          filter: sp => sp.setQuery('yep'),
        },
        {
          toggle: {
            facet: false,
          },
        }
      );

      expect(params.query).toEqual('');
    });

    it('registers its filter in metadata', () => {
      let metadata = getMetadata({ attribute: 't' }, {});
      expect(metadata).toEqual({
        items: [],
        id: 't',
        index: 'index',
      });

      metadata = getMetadata(
        { attribute: 't', label: 'yep' },
        { toggle: { t: true } }
      );
      expect(metadata).toEqual({
        items: [
          {
            label: 'yep',
            // Ignore clear, we test it later
            value: metadata.items[0].value,
            attribute: 't',
            currentRefinement: true,
          },
        ],
        id: 't',
        index: 'index',
      });
    });

    it('items value function should clear it from the search state', () => {
      const metadata = getMetadata(
        { attribute: 'one', label: 'yep' },
        { toggle: { one: true, two: false } }
      );

      const searchState = metadata.items[0].value({
        toggle: { one: true, two: false },
      });

      expect(searchState).toEqual({
        page: 1,
        toggle: { one: false, two: false },
      });
    });

    it('should return the right searchState when clean up', () => {
      let searchState = cleanUp(
        { attribute: 'name' },
        {
          toggle: { name: 'searchState', name2: 'searchState' },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({
        toggle: { name2: 'searchState' },
        another: { searchState: 'searchState' },
      });

      searchState = cleanUp({ attribute: 'name2' }, searchState);
      expect(searchState).toEqual({
        toggle: {},
        another: { searchState: 'searchState' },
      });
    });
  });

  describe('multi index', () => {
    let context = {
      context: {
        ais: { mainTargetedIndex: 'first' },
        multiIndexContext: { targetedIndex: 'first' },
      },
    };

    const createMultiIndexSearchState = (state = {}) => ({
      indices: {
        first: state,
      },
    });

    const createMultiIndexSearchResults = (...args) => ({
      results: {
        first: createSearchResults(...args),
      },
    });

    const getProvidedProps = connect.getProvidedProps.bind(context);
    const getSP = connect.getSearchParameters.bind(context);
    const getMetadata = connect.getMetadata.bind(context);
    const cleanUp = connect.cleanUp.bind(context);

    it('expect `currentRefinement` to be `true` when the value is checked', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState({
        toggle: { shipping: true },
      });
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(true);
    });

    it('expect `currentRefinement` to be `false` when the value is not checked', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(false);
    });

    it('expect `currentRefinement` to be `defaultRefinement`', () => {
      const props = {
        defaultRefinement: true,
        attribute: 'shipping',
        value: true,
      };
      const searchState = createMultiIndexSearchState();
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.currentRefinement).toBe(true);
    });

    it('expect `canRefine` to be `true` with results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = createMultiIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 100,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(true);
    });

    it('expect `canRefine` to be `false` with a value count of 0', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = createMultiIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 0,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `canRefine` to be `false` without the facet', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = createMultiIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {},
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `canRefine` to be `false` without results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.canRefine).toBe(false);
    });

    it('expect `count` to match facet values with results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = createMultiIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {
          shipping: {
            true: 100,
            false: 50,
          },
        },
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: 150,
        unchecked: 100,
      });
    });

    it('expect `count` to be null without the facet', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = createMultiIndexSearchResults({
        disjunctiveFacets: ['shipping'],
        facets: {},
      });

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: null,
        unchecked: null,
      });
    });

    it('expect `count` to be null without results', () => {
      const props = { attribute: 'shipping', value: true };
      const searchState = createMultiIndexSearchState();
      const searchResults = {};

      const actual = getProvidedProps(props, searchState, searchResults);

      expect(actual.count).toEqual({
        checked: null,
        unchecked: null,
      });
    });

    it("calling refine updates the widget's search state", () => {
      let refine = connect.refine.bind(context);

      let searchState = refine(
        { attribute: 't' },
        {
          otherKey: 'val',
          indices: { first: { toggle: { otherKey: false } } },
        },
        true
      );
      expect(searchState).toEqual({
        otherKey: 'val',
        indices: { first: { page: 1, toggle: { t: true, otherKey: false } } },
      });

      context = {
        context: {
          ais: { mainTargetedIndex: 'first' },
          multiIndexContext: { targetedIndex: 'second' },
        },
      };
      refine = connect.refine.bind(context);

      searchState = refine(
        { attribute: 't' },
        { indices: { first: { toggle: { t: true, otherKey: false } } } },
        false
      );
      expect(searchState).toEqual({
        indices: {
          first: { toggle: { t: true, otherKey: false } },
          second: { page: 1, toggle: { t: false } },
        },
      });
    });

    it('refines the corresponding facet with `true`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          value: 'val',
        },
        {
          indices: {
            first: {
              toggle: {
                facet: true,
              },
            },
          },
        }
      );

      expect(params.getDisjunctiveRefinements('facet')).toEqual(['val']);
    });

    it('does not refine the corresponding facet with `false`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          value: 'val',
        },
        {
          indices: {
            first: {
              toggle: {
                facet: false,
              },
            },
          },
        }
      );

      expect(params.getDisjunctiveRefinements('facet')).toEqual([]);
    });

    it('applies the provided filter with `true`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          filter: sp => sp.setQuery('yep'),
        },
        {
          indices: {
            first: {
              toggle: {
                facet: true,
              },
            },
          },
        }
      );

      expect(params.query).toEqual('yep');
    });

    it('does not apply the provided filter with `false`', () => {
      const params = getSP(
        new SearchParameters(),
        {
          attribute: 'facet',
          filter: sp => sp.setQuery('yep'),
        },
        {
          indices: {
            first: {
              toggle: {
                facet: false,
              },
            },
          },
        }
      );

      expect(params.query).toEqual('');
    });

    it('registers its filter in metadata', () => {
      const metadata = getMetadata(
        { attribute: 't', label: 'yep' },
        { indices: { first: { toggle: { t: true } } } }
      );
      expect(metadata).toEqual({
        items: [
          {
            label: 'yep',
            // Ignore clear, we test it later
            value: metadata.items[0].value,
            attribute: 't',
            currentRefinement: true,
          },
        ],
        id: 't',
        index: 'first',
      });
    });

    it('items value function should clear it from the search state', () => {
      const metadata = getMetadata(
        { attribute: 'one', label: 'yep' },
        { indices: { first: { toggle: { one: true, two: false } } } }
      );

      const searchState = metadata.items[0].value({
        indices: { first: { toggle: { one: true, two: false } } },
      });

      expect(searchState).toEqual({
        indices: { first: { page: 1, toggle: { one: false, two: false } } },
      });
    });

    it('should return the right searchState when clean up', () => {
      let searchState = cleanUp(
        { attribute: 'name' },
        {
          indices: {
            first: { toggle: { name: 'searchState', name2: 'searchState' } },
          },
          another: { searchState: 'searchState' },
        }
      );
      expect(searchState).toEqual({
        indices: { first: { toggle: { name2: 'searchState' } } },
        another: { searchState: 'searchState' },
      });

      searchState = cleanUp({ attribute: 'name2' }, searchState);
      expect(searchState).toEqual({
        indices: { first: { toggle: {} } },
        another: { searchState: 'searchState' },
      });
    });
  });
});
