---
layout: ../../layouts/WidgetLayout.astro
title: ClearRefinements
type: widget
html: |
  <div class="ais-ClearRefinements">
    <button class="ais-ClearRefinements-button">
      Clear refinements
    </button>
  </div>
alt1: Button disabled
althtml1: |
  <div class="ais-ClearRefinements">
    <button class="ais-ClearRefinements-button ais-ClearRefinements-button--disabled" disabled>
      Clear refinements
    </button>
  </div>
classes:
  - name: .ais-ClearRefinements
    description: the root div of the widget
  - name: .ais-ClearRefinements-button
    description: the clickable button
  - name: .ais-ClearRefinements-button--disabled
    description: the disabled clickable button
options:
  - name: includedAttributes
    default: all searchable attributes
    description: The attributes to include in the refinements (all by default)
  - name: excludedAttributes
    default: "['query']"
    description: The attributes to exclude from the refinements
  - name: transformItems
    description: Function which receives the items, which will be called before displaying them. Should return a new array with the same shape as the original array. Useful for mapping over the items to transform, remove or reorder them
translations:
  - name: resetButtonText
    default: '"Clear refinements"'
    description: The text for the reset button.
---
