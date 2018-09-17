import { VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';
import { SearchReplacePluginManager } from './SearchReplacePluginManager';

/**
 * The Finder UI Component.
 */
export class SearchReplacePanel extends VDomRenderer<
  SearchReplacePluginManager
> {
  /**
   * Create new sidebar.
   */
  constructor() {
    super();
    this.addClass(FINDER_CLASS);
  }

  /**
   * Handle getMatchRanges input change.
   * @param event
   */
  handleInputChange = event => {
    this.model.plugin.setQuery({
      value: event.target.value,

      isRegEx: false, // need to add checkbox
      ignoreCase: false // need to add checkbox
    });
    event.stopPropagation();
  };

  /**
   * Handle 'Find' button clicked.
   * @param event
   */
  nextClicked = event => {
    this.model.plugin.next();
    event.stopPropagation();
  };

  /**
   * Handle 'Find All' button clicked.
   * @param event
   */
  prevClicked = event => {
    this.model.plugin.prev();
    event.stopPropagation();
  };

  /**
   * Handle 'Replace' button clicked.
   * @param event
   */
  replaceClicked = event => {
    this.model.plugin.replace();
    event.stopPropagation();
  };

  /**
   * Render FinderPanel React Element
   */
  protected render(): React.ReactElement<any> {
    return (
      <div className={FIND_REPLACE_SIDEBAR_CLASS}>
        <div className={SEARCH_CLASS}>
          <div className={SEARCH_WRAPPER}>
            <input
              className={INPUT_CLASS}
              spellCheck={false}
              placeholder={'Find...'}
              onChange={e => this.handleInputChange(e)}
            />
          </div>
        </div>
        <div className={BUTTON_CONTAINER}>
          <button className={BUTTON_CLASS} onClick={e => this.nextClicked(e)}>
            Next
          </button>
          <button className={BUTTON_CLASS} onClick={e => this.prevClicked(e)}>
            Prev
          </button>
        </div>
        <div className={SEARCH_CLASS}>
          <div className={SEARCH_WRAPPER}>
            <input
              className={INPUT_CLASS}
              spellCheck={false}
              placeholder={'Replace...'}
            />
          </div>
        </div>
        <div className={BUTTON_CONTAINER}>
          <button
            className={BUTTON_CLASS}
            onClick={e => this.replaceClicked(e)}
          >
            Replace
          </button>
        </div>
      </div>
    );
  }
}

/**
 * CSS Classes for Finder Panel Component.
 */
const FIND_REPLACE_SIDEBAR_CLASS = 'jp-Finder';
const SEARCH_CLASS = 'jp-FindReplace-getMatchRanges';
const SEARCH_WRAPPER = 'jp-FindReplace-wrapper';
const INPUT_CLASS = 'jp-FindReplace-input';
const BUTTON_CLASS = 'jp-FindReplace-button';
const BUTTON_CONTAINER = 'jp-FindReplace-button-container';
const FINDER_CLASS = 'jp-Finder';
