import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { SearchReplaceModel } from './SearchReplaceModel';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { SearchReplacePanel } from './SearchReplacePanel';
import '../style/index.css';

/**
 * Constants.
 */
export const EXTENSION_ID: string = '@jupyterlab/searchreplace:plugin';

/**
 * SearchReplace plugin.
 */
const plugin: JupyterLabPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, IDocumentManager],
  activate: activateSearchReplacePlugin
};

/**
 * Activate the SearchReplace-plugin.
 */
function activateSearchReplacePlugin(
  app: JupyterLab,
  palette: ICommandPalette,
  docManager: IDocumentManager
): void {
  const { shell } = app;
  const namespace = 'search-replace';

  // Initialize view panel.
  const panel = new SearchReplacePanel();
  panel.id = namespace;
  panel.title.label = 'Search / Replace';

  // Initialize model.
  const model = new SearchReplaceModel({
    shell,
    docManager
  });

  panel.model = model;

  // Add to left area and activate.
  shell.addToLeftArea(panel, { rank: 600 });
  shell.activateById(panel.id);
}

/**
 * Export plugin as default.
 */
export default plugin;
