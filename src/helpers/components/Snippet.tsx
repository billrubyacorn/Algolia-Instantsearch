/** @jsx h */
import { h } from 'preact';

import { Highlight as HighlightUiComponent } from '../../components/Highlight/Highlight';
import getHighlightedParts from '../../lib/utils/getHighlightedParts';
import getPropertyByPath from '../../lib/utils/getPropertyByPath';
import unescape from '../../lib/utils/unescape';

import type { BaseHit, Hit, PartialKeys } from '../../types';
import type { HighlightProps as HighlightUiComponentProps } from '../../components/Highlight/Highlight';

export type SnippetProps<THit extends Hit<BaseHit>> = {
  hit: THit;
  attribute: keyof THit | string[];
  cssClasses: HighlightUiComponentProps['classNames'];
} & PartialKeys<
  Omit<HighlightUiComponentProps, 'parts' | 'classNames'>,
  'highlightedTagName' | 'nonHighlightedTagName' | 'separator'
>;

export function Snippet<THit extends Hit<BaseHit>>({
  hit,
  attribute,
  cssClasses,
  ...props
}: SnippetProps<THit>) {
  const property =
    getPropertyByPath(hit._snippetResult, attribute as string) || [];
  const properties = Array.isArray(property) ? property : [property];

  const parts = properties.map(({ value }) =>
    getHighlightedParts(unescape(value || ''))
  );

  return (
    <HighlightUiComponent {...props} parts={parts} classNames={cssClasses} />
  );
}
