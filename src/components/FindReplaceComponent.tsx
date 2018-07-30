import * as React from 'react';

const FIND_REPLACE_SIDEBAR_CLASS = 'jp-FindReplaceSidebar';
const SEARCH_CLASS = 'jp-FindReplace-search';
const SEARCH_WRAPPER = 'jp-FindReplace-wrapper';
const INPUT_CLASS = 'jp-FindReplace-input';
const BUTTON_CLASS = 'jp-FindReplace-button';
const BUTTON_CONTAINER = 'jp-FindReplace-button-container';
/**
 * A react component that represents the UI contents of the extension sidebar.
 * This component is initially rendered by the parent Phosphor adapter, the
 * FindReplaceSidebar VDomRenderer.
 */
export default class FindReplaceComponent extends React.Component<any, any> {
  /**
   * Create the Component.
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div className={FIND_REPLACE_SIDEBAR_CLASS}>
        <div className={SEARCH_CLASS}>
          <div className={SEARCH_WRAPPER}>
            <input
              className={INPUT_CLASS}
              spellCheck={false}
              placeholder={'SEARCH'}
            />
          </div>
        </div>
        <div className={BUTTON_CONTAINER}>
          <button className={BUTTON_CLASS}>Find</button>
          <button className={BUTTON_CLASS}>Find All</button>
        </div>
      </div>
    );
  }
}
