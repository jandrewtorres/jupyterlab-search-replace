import {
  JupyterLab,
  JupyterLabPlugin,
  ILayoutRestorer,
} from '@jupyterlab/application';

import {
  ICommandPalette,
  VDomRenderer,
  VDomModel,
} from '@jupyterlab/apputils';

import FindReplaceSidebar from './FindReplaceSidebar';

import '../style/index.css';

/**
 * Plugin id (also used as DOM ref id), and sidebar tab title.
 */
export const FIND_REPLACE_EXT_ID: string = 'find-replace-extension';
export const SIDEBAR_TITLE: string = 'Find / Replace';

/**
 * The command IDs used by the find-replace plugin.
 */
namespace CommandIDs {
  export const open: string = 'find-replace:open'; //
}


/**
 * Service providing interface to the find-replace-extension.
 */
const findReplaceExtension: JupyterLabPlugin<void> = {
  id: FIND_REPLACE_EXT_ID,
  autoStart: true,
  requires: [
    ICommandPalette,
    ILayoutRestorer,
  ],
  activate: activateFindReplacePlugin,
};

/**
 * Activate the find-replace-extension as a sidebar.
 */
function activateFindReplacePlugin(
  app: JupyterLab,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
): void {
  // Create the sidebar widget
  const sidebar: VDomRenderer<VDomModel> = new FindReplaceSidebar({ id: FIND_REPLACE_EXT_ID, title: SIDEBAR_TITLE });

  // Add the sidebar to the restorer.
  restorer.add(sidebar, FIND_REPLACE_EXT_ID);

  // Add the open sidebar command to the application.
  app.commands.addCommand(CommandIDs.open, {
    label: 'Find / Replace',
    execute: () => {
      if (!sidebar.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToLeftArea(sidebar, { rank: 800 });
      }
      // Activate the widget
      app.shell.activateById(sidebar.id);
    }
  });

  // Add the command to the palette.
  palette.addItem({ command: CommandIDs.open, category: 'File Operations' });
}

export default findReplaceExtension;
