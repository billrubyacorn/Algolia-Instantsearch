const { algoliasearch, instantsearch } = window;
const { autocomplete } = window['@algolia/autocomplete-js'];
const { createLocalStorageRecentSearchesPlugin } = window[
  '@algolia/autocomplete-plugin-recent-searches'
];
const { createQuerySuggestionsPlugin } = window[
  '@algolia/autocomplete-plugin-query-suggestions'
];

const searchClient = algoliasearch('A8O9E2W1YP', 'b5c60b84955105f6d25da6bea66c580b');

const search = instantsearch({
  indexName: 'ruby_products',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
  insights: true,
});

const virtualSearchBox = instantsearch.connectors.connectSearchBox(() => {});

search.addWidgets([
  virtualSearchBox({}),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
<article>
  <h1>${components.Highlight({hit, attribute: "title"})}</h1>
  <p>${components.Highlight({hit, attribute: "product_type"})}</p>
  <p>${components.Highlight({hit, attribute: "sku"})}</p>
  <p>${components.Highlight({hit, attribute: "body_html_safe"})}</p>
  <p>${components.Highlight({hit, attribute: "meta"})}</p>
</article>
`,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.dynamicWidgets({
    container: '#dynamic-widgets',
    fallbackWidget({ container, attribute }) {
      return instantsearch.widgets.panel({ templates: { header: () => attribute } })(
        instantsearch.widgets.refinementList
      )({
        container,
        attribute,
      });
    },
    widgets: [
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'price_range' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'price_range',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.use' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.use',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.zone' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.zone',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.light' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.light',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.water' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.water',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.featured' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.featured',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.bulb_type' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.bulb_type',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.bloom_season' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.bloom_season',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.growth_habit' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.growth_habit',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.plant_height' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.plant_height',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.plant_spread' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.plant_spread',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.planted_season' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.planted_season',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.plant_resistance' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.plant_resistance',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.growing_conditions' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.growing_conditions',
        }),
      container =>
        instantsearch.widgets.panel({
          templates: { header: () => 'meta.custom.plant_characteristics' },
        })(instantsearch.widgets.refinementList)({
          container,
          attribute: 'meta.custom.plant_characteristics',
        }),
    ],
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'instantsearch',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ setIsOpen, setQuery, item, event }) {
        onSelect({ setQuery, setIsOpen, event, query: item.label });
      },
    };
  },
});

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'ruby_products_query_suggestions',
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({ hitsPerPage: 6 });
  },
  transformSource({ source }) {
    return {
      ...source,
      sourceId: 'querySuggestionsPlugin',
      onSelect({ setIsOpen, setQuery, event, item }) {
        onSelect({ setQuery, setIsOpen, event, query: item.query });
      },
      getItems(params) {
        if (!params.state.query) {
          return [];
        }

        return source.getItems(params);
      },
    };
  },
});

autocomplete({
  container: '#searchbox',
  openOnFocus: true,
  detachedMediaQuery: 'none',
  onSubmit({ state }) {
    setInstantSearchUiState({ query: state.query });
  },
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
});

function setInstantSearchUiState(indexUiState) {
  search.mainIndex.setIndexUiState({ page: 1, ...indexUiState });
}

function onSelect({ setIsOpen, setQuery, event, query }) {
  if (isModifierEvent(event)) {
    return;
  }

  setQuery(query);
  setIsOpen(false);
  setInstantSearchUiState({ query });
}

function isModifierEvent(event) {
  const isMiddleClick = event.button === 1;

  return (
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}
