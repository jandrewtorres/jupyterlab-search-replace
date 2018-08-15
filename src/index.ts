import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';
import { ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';
import { Finder } from './Finder';
import { FinderModel } from './FinderModel';
import { INotebookTracker } from '@jupyterlab/notebook';
import '../style/index.css';

/**
 * Constants.
 */
export const EXTENSION_ID: string = '@jupyterlab/finder-extension:plugin';
export const PLUGIN_TITLE: string = 'Finder';

/**
 * The command IDs used by the finder plugin.
 */
namespace CommandIDs {
  export const open: string = 'finder:open';
}

/**
 * Finder plugin.
 */
const plugin: JupyterLabPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, INotebookTracker],
  activate: activateFinderPlugin
};

/**
 * Activate the finder-plugin.
 */
function activateFinderPlugin(
  app: JupyterLab,
  palette: ICommandPalette,
  notebookTracker: INotebookTracker
): void {
  const { commands, shell } = app;
  const namespace = 'finder';
  // Tracker is used to ensure there is only one instance of the Finder
  const tracker = new InstanceTracker<Finder>({ namespace });
  // Finder Model
  const model = new FinderModel(shell, notebookTracker);
  // Finder View
  let finder: Finder;

  // Add Commands
  commands.addCommand(CommandIDs.open, {
    label: 'Open Finder',
    execute: () => {
      // If finder is already open, activate and return.
      if (tracker.currentWidget) {
        shell.activateById(tracker.currentWidget.id);
        return;
      }

      // Initialize view and set model.
      finder = new Finder();
      finder.id = namespace;
      finder.title.label = 'Finder';
      finder.model = model;

      // Add to left area and activate.
      shell.addToLeftArea(finder, { rank: 600 });
      shell.activateById(finder.id);

      // Add to tracker
      tracker.add(finder);
    }
  });

  // Add Commands to Command Palette
  palette.addItem({ command: CommandIDs.open, category: PLUGIN_TITLE });
}

/**
 * Export plugin as default.
 */
export default plugin;
