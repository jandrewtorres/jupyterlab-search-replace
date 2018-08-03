import {
  JupyterLab,
  JupyterLabPlugin,
} from '@jupyterlab/application';

import {
  ICommandPalette,
} from '@jupyterlab/apputils';

import { Finder } from './Finder';
import { FinderModel } from './FinderModel';
import { Token } from '@phosphor/coreutils';

import '../style/index.css';

/**
 * Constants.
 */
export const EXTENSION_ID: string = '@jupyterlab/finder-extension:plugin';
export const PLUGIN_TITLE: string = 'Finder';

export const IFinderService = new Token<IFinderService>(EXTENSION_ID);


export interface IFinderService {
  /**
   * Text Documents
   */
  find();
}

/**
 * The command IDs used by the finder plugin.
 */
namespace CommandIDs {
  export const open: string = 'finder:open';
}

/**
 * Service providing interface to the finder-plugin.
 */
const plugin: JupyterLabPlugin<IFinderService> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [
    ICommandPalette,
  ],
  provides: IFinderService,
  activate: activateFinderPlugin,
};

/**
 * Activate the finder-plugin.
 */
function activateFinderPlugin(
  app: JupyterLab,
  palette: ICommandPalette,
): IFinderService {
  const { commands, shell } = app;
  const model = new FinderModel();

  // Add Commands
  commands.addCommand(CommandIDs.open, {
    label: 'Open Finder',
    execute: () => {
      const finder = new Finder({});
      finder.title.label = 'Finder';
      shell.addToLeftArea(finder, { rank: 600 });

    }

  });
  palette.addItem({ command: CommandIDs.open, category: PLUGIN_TITLE });

  return model;
}

/**
 * Export plugin as default.
 */
export default plugin;
