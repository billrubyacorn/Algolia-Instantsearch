import React, {PropTypes, Component} from 'react';

import themeable from '../themeable';

import List from './List';

class NumericRefinementList extends Component {
  static propTypes = {
    applyTheme: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
    selectedItem: PropTypes.string.isRequired,
    refine: PropTypes.func.isRequired,
  };

  renderItem = (item, selected) => {
    const {applyTheme, refine} = this.props;

    return (
      <label>
        <input
          {...applyTheme('itemRadio', 'itemRadio')}
          type="radio"
          checked={selected}
          onChange={refine.bind(null, item.value)}
        />
        <span {...applyTheme('itemLabel', 'itemLabel')}>
          {item.label}
        </span>
      </label>
    );
  };

  render() {
    const {items, selectedItem, applyTheme} = this.props;

    return (
      <List
        renderItem={this.renderItem}
        showMore={false}
        applyTheme={applyTheme}
        items={items}
        selectedItems={[selectedItem]}
      />
    );
  }
}

export default themeable({
  root: 'NumericRefinementList',
  items: 'NumericRefinementList__items',
  item: 'NumericRefinementList__item',
  itemSelected: 'NumericRefinementList__item--selected',
  itemLabel: 'NumericRefinementList__item__label',
})(NumericRefinementList);
