import * as React from 'react';

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
    const textStuff = "Hi my name is drew";
    return (
      <div> {textStuff} </div>
    );
  }
}
