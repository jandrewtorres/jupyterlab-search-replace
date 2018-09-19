import { Widget } from '@phosphor/widgets';
import { SearchReplacePanel } from './SearchReplacePanel';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { SearchReplacePluginManager } from '../SearchReplacePluginManager';
import { Component } from 'react';

export class SearchReplaceWidget extends Widget {
  constructor(pluginManager: SearchReplacePluginManager) {
    super();
    this.addClass(FINDER_CLASS);
    const element = <SearchReplacePanel pluginManager={pluginManager} />;
    this._component = ReactDOM.render(element, this.node);
    (this._component as Component).forceUpdate();
  }

  private _component: any;
}

const FINDER_CLASS = 'jp-Finder';
