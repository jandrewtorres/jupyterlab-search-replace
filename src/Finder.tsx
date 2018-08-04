import { VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';

import { FinderPanel } from './components/FinderPanel';
import { FinderModel } from './FinderModel';

const FINDER_CLASS = 'jp-Finder';

/**
 * A side bar widget for document-wide find / replace.
 */
export class Finder extends VDomRenderer<FinderModel> {
  /**
   * Create new sidebar.
   */
  constructor(options) {
    super();
    this.addClass(FINDER_CLASS);
  }

  /**
   * Render UI react component
   */
  protected render(): React.ReactElement<any> {
    return <FinderPanel />;
  }
}
