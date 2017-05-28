import algoliaClient from 'algoliasearch';
import algoliaHelper from 'algoliasearch-helper';

import {
  FACET_AND,
  FACET_OR,
  FACET_TREE,
  HIGHLIGHT_PRE_TAG,
  HIGHLIGHT_POST_TAG,
  assertValidFacetType,
  createFromAlgoliaCredentials,
  createFromAlgoliaClient,
  Store,
} from '../store';

const createStore = () => {
  const client = algoliaClient('app_id', 'api_key');
  const helper = algoliaHelper(client);

  return new Store(helper);
};

test('FACET_AND should be "and"', () => {
  expect(FACET_AND).toBe('and');
});

test('FACET_OR should be "or"', () => {
  expect(FACET_OR).toBe('or');
});

test('FACET_TREE should be "tree"', () => {
  expect(FACET_TREE).toBe('tree');
});

test('HIGHLIGHT_PRE_TAG should be "__ais-highlight__"', () => {
  expect(HIGHLIGHT_PRE_TAG).toBe('__ais-highlight__');
});

test('HIGHLIGHT_POST_TAG should be "__/ais-highlight__"', () => {
  expect(HIGHLIGHT_POST_TAG).toBe('__/ais-highlight__');
});

test('can assert that a facet type is valid', () => {
  expect(() => {
    assertValidFacetType(FACET_AND);
  }).not.toThrow();
  expect(() => {
    assertValidFacetType(FACET_OR);
  }).not.toThrow();
  expect(() => {
    assertValidFacetType(FACET_TREE);
  }).not.toThrow();
  expect(() => {
    assertValidFacetType('unknown');
  }).toThrow();
});

test('can create a Store instance from algolia credentials', () => {
  const store = createFromAlgoliaCredentials('app_id', 'api_key');
  expect(store).toBeInstanceOf(Store);
  expect(store.algoliaApiKey).toBe('api_key');
  expect(store.algoliaAppId).toBe('app_id');
});

test('can create a Store instance from an algolia client', () => {
  const client = algoliaClient('app_id', 'api_key');
  const store = createFromAlgoliaClient(client);
  expect(store).toBeInstanceOf(Store);
  expect(store.algoliaClient).toBe(client);
});

describe('Store', () => {
  test('should be constructed with a helper instance', () => {
    const client = algoliaClient('app_id', 'api_key');
    const helper = algoliaHelper(client);
    const store = new Store(helper);

    expect(store.algoliaHelper).toBe(helper);
  });

  test('should throw an exception if not constructed with a helper', () => {
    expect(() => {
      new Store({});
    }).toThrow(
      TypeError(
        'Store should be constructed with an AlgoliaSearchHelper instance as first parameter.'
      )
    );
  });

  test('should always use custom highlighting tags', () => {
    const store = createStore();

    expect(store.highlightPreTag).toEqual(HIGHLIGHT_PRE_TAG);
    expect(store.highlightPostTag).toEqual(HIGHLIGHT_POST_TAG);
  });

  test('can retrieve index name', () => {
    const store = createStore();
    store._helper.setIndex('my_index');

    expect(store.indexName).toEqual('my_index');
  });

  test('can set index name', () => {
    const store = createStore();
    store.indexName = 'custom_index_name';

    expect(store.indexName).toEqual('custom_index_name');
  });

  test('can retrieve the current page', () => {
    const store = createStore();
    store._helper.setPage(1);

    expect(store.page).toEqual(2);
  });

  test('can change the current page', () => {
    const store = createStore();
    store.page = 2;

    expect(store._helper.getPage()).toEqual(1);
    expect(store.page).toEqual(2);
  });

  test('should add "vue-instantsearch" User Agent to the client with the current version', () => {
    const addAlgoliaAgent = jest.fn();
    const client = {
      addAlgoliaAgent,
    };

    const helper = algoliaHelper(client);
    new Store(helper);
    const version = require('../../package.json').version;
    expect(addAlgoliaAgent).toBeCalledWith(`vue-instantsearch ${version}`);
  });

  test('should throw an error upon adding a facet of unkown type', () => {
    const store = createStore();
    expect(() => {
      store.addFacet('attribute', 'unknown');
    }).toThrow(Error);
  });

  test('can register a conjunctive facet for retrieval', () => {
    const store = createStore();
    store.addFacet('attribute');

    expect(store._helper.state.isConjunctiveFacet('attribute')).toBe(true);
  });

  test('should remove existing non conjunctive facet if a conjunctive facet is added for retrieval', () => {
    const store = createStore();
    store.addFacet('attribute', FACET_OR);
    store.addFacet('attribute');

    expect(store._helper.state.isConjunctiveFacet('attribute')).toBe(true);
    expect(store._helper.state.isDisjunctiveFacet('attribute')).toBe(false);
  });

  test('can register a disjunctive facet for retrieval', () => {
    const store = createStore();
    store.addFacet('attribute', FACET_OR);

    expect(store._helper.state.isDisjunctiveFacet('attribute')).toBe(true);
  });

  test('should remove existing non disjunctive facet if a disjunctive facet is added for retrieval', () => {
    const store = createStore();
    store.addFacet('attribute');
    store.addFacet('attribute', FACET_OR);

    expect(store._helper.state.isDisjunctiveFacet('attribute')).toBe(true);
    expect(store._helper.state.isConjunctiveFacet('attribute')).toBe(false);
  });

  test('can register a hierarchical facet for retrieval', () => {
    const store = createStore();
    store.addFacet({ name: 'attribute' }, FACET_TREE);

    expect(store._helper.state.isHierarchicalFacet('attribute')).toBe(true);
  });

  test('should remove existing non hierarchical facet if a hierarchical facet is added for retrieval', () => {
    const store = createStore();
    store.addFacet('attribute');
    store.addFacet({ name: 'attribute' }, FACET_TREE);

    expect(store._helper.state.isHierarchicalFacet('attribute')).toBe(true);
    expect(store._helper.state.isConjunctiveFacet('attribute')).toBe(false);
  });

  test('should merge query parameters with existing ones', () => {
    const store = createStore();
    store.queryParameters = {
      attributesToRetrieve: ['objectID'],
      nonRetrievableAttributes: ['secret'],
    };

    expect(store.queryParameters).toHaveProperty('attributesToRetrieve', [
      'objectID',
    ]);
    expect(store.queryParameters).toHaveProperty('nonRetrievableAttributes', [
      'secret',
    ]);

    // Ensure parameters have been merged with existing ones.
    expect(Object.keys(store.queryParameters).length).toBeGreaterThan(2);
  });

  test('can retrieve query parameters', () => {
    const store = createStore();
    store._helper.setQueryParameter('distinct', 1);
    store._helper.setPage(3);

    expect(store.queryParameters).toHaveProperty('distinct', 1);

    // Ensure that pages start at 1 by making sure our initial 3 became 4.
    expect(store.queryParameters).toHaveProperty('page', 4);
  });

  test('should reset page when query parameters are changed', () => {
    const store = createStore();
    store.page = 2;
    store.queryParameters = {
      distinct: 1,
      attributesToRetrieve: ['objectID'],
    };

    expect(store.page).toEqual(1);
  });

  test('should allow page to be changed by updating query parameters', () => {
    const store = createStore();
    store.queryParameters = {
      page: 3,
      distinct: 1,
      attributesToRetrieve: ['objectID'],
    };

    expect(store.page).toEqual(3);
  });

  test('should trigger search only once when query parameters are changed', () => {
    const store = createStore();
    const search = jest.fn();

    store._helper.search = search;

    store.start();

    store._helper.search.mockClear();

    store.queryParameters = {
      page: 3,
      distinct: 1,
      attributesToRetrieve: ['objectID'],
    };

    expect(search).toHaveBeenCalledTimes(1);
  });

  test('should remove query parameters that have a value of null or undefined', () => {
    const store = createStore();
    const search = jest.fn();
    store._helper.getClient().search = search;

    store.queryParameters = {
      query: '',
      page: 3,
      distinct: 1,
      attributesToRetrieve: ['objectID'],
    };

    // Make sure distinct parameter is there.
    expect(store.queryParameters).toHaveProperty('distinct');

    store.queryParameters = {
      page: 3,
      distinct: undefined,
      attributesToRetrieve: ['objectID'],
    };

    // Make sure distinct parameter is gone when overrided with undefined.
    expect(store.queryParameters).not.toHaveProperty('distinct');

    store.queryParameters = {
      page: 3,
      distinct: null,
      attributesToRetrieve: ['objectID'],
    };
    store.addFacet('price');

    // Make sure distinct parameter is gone when overrided with null.
    expect(store.queryParameters).not.toHaveProperty('distinct');
  });

  test('should allow to retrieve all the search parameters', () => {
    const store = createStore();

    const searchParameters = Object.assign({}, store._helper.getState(), {
      page: 1,
    });
    expect(store.searchParameters).toEqual(searchParameters);
  });

  test('should accept new search parameters', () => {
    const store = createStore();

    const searchParameters = store._helper.getState();
    const newSearchParameters = Object.assign({}, searchParameters, {
      distinct: true,
      page: 1,
    });

    store.searchParameters = newSearchParameters;

    expect(store.searchParameters).toEqual(newSearchParameters);
  });

  test('page search parameter should start at 1', () => {
    const store = createStore();

    expect(store.searchParameters).toHaveProperty('page', 1);

    store._helper.setPage(2);
    expect(store.searchParameters).toHaveProperty('page', 3);

    const newSearchParameters = Object.assign({}, store.searchParameters, {
      page: 5,
    });

    store.searchParameters = newSearchParameters;

    expect(store._helper.getPage()).toEqual(4);
  });
});
