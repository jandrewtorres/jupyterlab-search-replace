import * as React from 'react';
import { SearchReplacePluginManager } from '../SearchReplacePluginManager';

export class SearchReplacePanel extends React.Component<any, any> {
  private readonly _searchInput: React.RefObject<HTMLInputElement>;
  private _pluginManager: SearchReplacePluginManager;

  constructor(props: any) {
    super(props);
    this.state = {
      searchPattern: '',
      replaceValue: ''
    };
    this._searchInput = React.createRef<HTMLInputElement>();
    this._pluginManager = props.pluginManager;
  }

  componentDidMount() {
    this._searchInput.current.focus();
  }

  nextClicked = event => {
    this._pluginManager.next();
    event.stopPropagation();
  };

  prevClicked = event => {
    this._pluginManager.prev();
    event.stopPropagation();
  };

  replaceAllClicked = event => {
    this._pluginManager.replaceAll('A');
    event.stopPropagation();
  };

  replaceClicked = event => {
    this._pluginManager.replace('A');
    event.stopPropagation();
  };

  handleInputChange = event => {
    this.setState(
      {
        searchPattern: event.target.value
      },
      () => {
        this._pluginManager.setQuery({
          value: this.state.searchPattern,
          isRegEx: false, // need to add checkbox
          ignoreCase: false // need to add checkbox
        });
        this._searchInput.current.focus();
      }
    );
    event.stopPropagation();
  };

  render(): React.ReactElement<any> {
    return (
      <div className={FIND_REPLACE_SIDEBAR_CLASS}>
        <div className={SEARCH_CLASS}>
          <div className={SEARCH_WRAPPER}>
            <input
              className={INPUT_CLASS}
              spellCheck={false}
              placeholder={'Search...'}
              onChange={e => this.handleInputChange(e)}
              ref={this._searchInput}
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
