import * as React from 'react';
import {classNames} from '@shopify/css-utilities';
import styles from './Section.scss';

export interface Props {
  children?: React.ReactNode;
  flush?: boolean;
  subdued?: boolean;
}

/** @uxpinnamespace Modal */
export default function Section({
  children,
  flush = false,
  subdued = false,
}: Props) {
  const className = classNames(
    styles.Section,
    flush && styles.flush,
    subdued && styles.subdued,
  );

  return <section className={className}>{children}</section>;
}
