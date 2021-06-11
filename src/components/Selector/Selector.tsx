/** @jsx h */

import { h } from 'preact';
import cx from 'classnames';

export type SelectorOption = {
  value?: string | number;
  label: string;
};

export type SelectorCSSClasses = {
  root?: string | string[];
  select?: string | string[];
  option?: string | string[];
};

export type SelectorProps = {
  cssClasses: SelectorCSSClasses;
  currentValue?: string | number;
  options: SelectorOption[];
  setValue(value: SelectorOption['value']): void;
};

function Selector({
  currentValue,
  options,
  cssClasses,
  setValue,
}: SelectorProps) {
  return (
    <select
      className={cx(cssClasses.select)}
      onChange={event => setValue((event.target as HTMLSelectElement).value)}
      value={`${currentValue}`}
    >
      {options.map(option => (
        <option
          className={cx(cssClasses.option)}
          key={option.label + option.value}
          value={`${option.value}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Selector;
