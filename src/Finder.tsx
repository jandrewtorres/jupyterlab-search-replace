import { VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';

import { FinderModel } from './FinderModel';

/**
 * The Finder UI Component.
 */
export class Finder extends VDomRenderer<FinderModel> {
  /**
   * Create new sidebar.
   */
  constructor() {
    super();
    this.addClass(FINDER_CLASS);
  }

  /**
   * Handle search input change.
   * @param event
   */
  handleInputChange = event => {
    this.model.searchString = event.target.value;
  };

  /**
   * Handle replace input change.
   * @param event
   */
  handleReplaceInputChange = event => {
    this.model.replaceString = event.target.value;
  };

  /**
   * Handle 'Find' button clicked.
   * @param event
   */
  findClicked = event => {
    this.model.find();
    event.stopPropagation();
  };

  /**
   * Handle 'Find All' button clicked.
   * @param event
   */
  findAllClicked = event => {
    this.model.findAll();
    event.stopPropagation();
  };

  /**
   * Handle 'Replace' button clicked.
   * @param event
   */
  replaceClicked = event => {
    this.model.replace();
    event.stopPropagation();
  };

  /**
   * Render FinderPanel React Element
   */
  protected render(): React.ReactElement<any> {
    return (
      <FinderPanel
        handleInputChange={this.handleInputChange}
        findClicked={this.findClicked}
        findAllClicked={this.findAllClicked}
        handleReplaceInputChange={this.handleReplaceInputChange}
        replaceClicked={this.replaceClicked}
      />
    );
  }
}

/**
 * CSS Classes for Finder Panel Component.
 */
const FIND_REPLACE_SIDEBAR_CLASS = 'jp-Finder';
const SEARCH_CLASS = 'jp-FindReplace-search';
const SEARCH_WRAPPER = 'jp-FindReplace-wrapper';
const INPUT_CLASS = 'jp-FindReplace-input';
const BUTTON_CLASS = 'jp-FindReplace-button';
const BUTTON_CONTAINER = 'jp-FindReplace-button-container';
const FINDER_CLASS = 'jp-Finder';

/**
 * FinderPanel Stateless React Component.
 * @param props
 * @constructor
 */
// tslint:disable-next-line:variable-name
const FinderPanel = props => (
  <div className={FIND_REPLACE_SIDEBAR_CLASS}>
    <div className={SEARCH_CLASS}>
      <div className={SEARCH_WRAPPER}>
        <input
          className={INPUT_CLASS}
          spellCheck={false}
          placeholder={'Find...'}
          onChange={e => props.handleInputChange(e)}
        />
      </div>
    </div>
    <div className={BUTTON_CONTAINER}>
      <button className={BUTTON_CLASS} onClick={e => props.findClicked(e)}>
        Find
      </button>
      <button className={BUTTON_CLASS} onClick={e => props.findAllClicked(e)}>
        Find All
      </button>
    </div>
    <div className={SEARCH_CLASS}>
      <div className={SEARCH_WRAPPER}>
        <input
          className={INPUT_CLASS}
          spellCheck={false}
          placeholder={'Replace...'}
          onChange={e => props.handleReplaceInputChange(e)}
        />
      </div>
    </div>
    <div className={BUTTON_CONTAINER}>
      <button className={BUTTON_CLASS} onClick={e => props.replaceClicked(e)}>
        Replace
      </button>
    </div>
  </div>
);
