import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';

import { ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';

import { Finder } from './Finder';
import { FinderModel } from './FinderModel';

import '../style/index.css';
import { IFinderTracker } from './tracker';

/**
 * Constants.
 */
export const EXTENSION_ID: string = '@jupyterlab/finder-extension:plugin';
export const PLUGIN_TITLE: string = 'Finder';
const namespace = 'filebrowser';

/**
 * Plugin Token
 */
// tslint:disable-next-line

/**
 * The command IDs used by the finder plugin.
 */
namespace CommandIDs {
  export const open: string = 'finder:open';
}

/**
 * Service providing interface to the finder-plugin.
 */
const plugin: JupyterLabPlugin<IFinderTracker> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette],
  provides: IFinderTracker,
  activate: activateFinderPlugin
};

/**
 * Activate the finder-plugin.
 */
function activateFinderPlugin(
  app: JupyterLab,
  palette: ICommandPalette
): IFinderTracker {
  const { commands, shell } = app;
  const tracker = new InstanceTracker<Finder>({ namespace });
  const model = new FinderModel();

  // Add Commands
  commands.addCommand(CommandIDs.open, {
    label: 'Open Finder',
    execute: () => {
      let finder = tracker.currentWidget;
      if (finder) {
        shell.activateById('finder');
        return;
      }

      finder = new Finder({});
      finder.id = 'finder';
      finder.title.label = 'Finder';
      finder.model = model;
      shell.addToLeftArea(finder, { rank: 600 });
      shell.activateById(finder.id);
      tracker.add(finder);
    }
  });

  palette.addItem({ command: CommandIDs.open, category: PLUGIN_TITLE });

  return tracker;
}

/**
 * Export plugin as default.
 */
export default plugin;
