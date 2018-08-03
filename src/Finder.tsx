import { Widget, Title } from '@phosphor/widgets';
import { VDomRenderer } from '@jupyterlab/apputils';
import { Message } from '@phosphor/messaging';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import FindReplaceComponent from './components/FindReplaceComponent';
import { FinderModel } from './FinderModel';

const FIND_REPLACE_SIDEBAR_CLASS = 'jp-Finder';

/**
 * A side bar widget for document-wide find / replace.
 */
export class Finder extends VDomRenderer<FinderModel> {
  title: Title<Widget>;
  reactComponent: React.ReactElement<any>;

  /**
   * Create new sidebar.
   */
  constructor(options) {
    super();
    this.addClass(FIND_REPLACE_SIDEBAR_CLASS);
  }

  /**
   * Render the contents after the widget is shown.
   */
  protected onAfterShow(msg: Message): void {
    this.update();
  }

  /**
   * Handle and update() request.
   */
  protected onUpdateRequest(msg: Message): void {
    // do nothing if not visible
    if (!this.isVisible) {
      return;
    }
    // Create sidebar react component
    this.reactComponent = <FindReplaceComponent />;
    ReactDOM.render(this.reactComponent, document.getElementById(this.id));
  }

  /**
   * Render UI react component
   */
  protected render(): React.ReactElement<any> {
    return this.reactComponent;
  }
}
