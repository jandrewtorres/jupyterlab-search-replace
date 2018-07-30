import {
  JupyterLab,
  JupyterLabPlugin,
} from '@jupyterlab/application';

import {
  ICommandPalette,
} from '@jupyterlab/apputils';

import {
  Widget,
} from '@phosphor/widgets';

import '../style/index.css';

const FIND_REPLACE_EXT_ID = 'find_replace-extension';

/**
 * Initialization data for the find-replace-extension.
 */
const findReplaceExtension: JupyterLabPlugin<void> = {
  id: FIND_REPLACE_EXT_ID,
  autoStart: true,
  requires: [ICommandPalette],
  activate: activateFindReplacePlugin,
};


function activateFindReplacePlugin(
  app: JupyterLab,
  palette: ICommandPalette,
): void {
  // Create a single widget
  let widget: Widget = new Widget();
  widget.id = FIND_REPLACE_EXT_ID;
  widget.title.label = 'Find / Replace';
  widget.title.closable = true;

  // Add an application command
  const open: string = 'find-replace:open';

  app.commands.addCommand(open, {
    label: 'Find / Replace',
    execute: () => {
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToLeftArea(widget, { rank: 800 });
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({command: open, category: 'File Operations'});
}

export default findReplaceExtension;
