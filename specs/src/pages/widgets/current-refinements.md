---
layout: ../../layouts/WidgetLayout.astro
title: CurrentRefinements
type: widget
html: |
  <div class="ais-CurrentRefinements">
    <ul class="ais-CurrentRefinements-list">
      <li class="ais-CurrentRefinements-item">
        <span class="ais-CurrentRefinements-label">
          Category:
        </span>
        <span class="ais-CurrentRefinements-category">
          <span class="ais-CurrentRefinements-categoryLabel">Movies & TV Shows</span>
          <button class="ais-CurrentRefinements-delete">✕</button>
        </span>
        <span class="ais-CurrentRefinements-category">
          <span class="ais-CurrentRefinements-categoryLabel">Others</span>
          <button class="ais-CurrentRefinements-delete">✕</button>
        </span>
      </li>
    </ul>
  </div>
althtml1: |
  <div class="ais-CurrentRefinements">
    <ul class="ais-CurrentRefinements-list">
      <li class="ais-CurrentRefinements-item">
        <span class="ais-CurrentRefinements-label">
          Category:
        </span>
        <span class="ais-CurrentRefinements-category">
          <span class="ais-CurrentRefinements-categoryLabel">Movies & TV Shows</span>
          <button class="ais-CurrentRefinements-delete">✕</button>
        </span>
        <span class="ais-CurrentRefinements-category">
          <span class="ais-CurrentRefinements-categoryLabel">Others</span>
          <button class="ais-CurrentRefinements-delete">✕</button>
        </span>
      </li>
      <li class="ais-CurrentRefinements-item">
        <span class="ais-CurrentRefinements-label">
          Query:
        </span>
        <span class="ais-CurrentRefinements-category">
          <span class="ais-CurrentRefinements-categoryLabel">
            <q>my search</q>
          </span>
          <button class="ais-CurrentRefinements-delete">✕</button>
        </span>
      </li>
    </ul>
  </div>
alt1: with empty excludedAttributes
classes:
  - name: .ais-CurrentRefinements
    description: the root div of the widget
  - name: .ais-CurrentRefinements--noRefinement
    description: the root div of the widget with no refinement
  - name: .ais-CurrentRefinements-list
    description: the list of all refined items
  - name: .ais-CurrentRefinements-item
    description: the refined list item
  - name: .ais-CurrentRefinements-label
    description: the refined list label
  - name: .ais-CurrentRefinements-category
    description: the category of each item
  - name: .ais-CurrentRefinements-categoryLabel
    description: the label of each category
  - name: .ais-CurrentRefinements-delete
    description: the delete button of each category
  - name: .ais-CurrentRefinements-query
    description: the quote element if query is included
options:
  - name: includedAttributes
    default: all searchable attributes
    description: The attributes to include in the refinements (all by default)
  - name: excludedAttributes
    default: "['query']"
    description: The attributes to exclude from the refinements
  - name: transformItems
    description: Function which receives the items, which will be called before displaying them. Should return a new array with the same shape as the original array. Useful for mapping over the items to transform, remove or reorder them
---
