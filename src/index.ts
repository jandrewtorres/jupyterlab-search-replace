import { JupyterLab, JupyterLabPlugin } from '@jupyterlab/application';
import { ICommandPalette } from '@jupyterlab/apputils';
import { SearchReplacePluginManager } from './SearchReplacePluginManager';
import { IDocumentManager } from '@jupyterlab/docmanager';
import '../style/index.css';
import { SearchReplaceWidget } from './components/Widget';

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

  // Initialize and set model.
  const pluginManager = new SearchReplacePluginManager({ shell, docManager });

  // Initialize view;
  const widget = new SearchReplaceWidget(pluginManager);
  widget.id = namespace;
  widget.title.label = 'Search / Replace';

  // Add to left area and activate.
  shell.addToLeftArea(widget, { rank: 600 });
  shell.activateById(widget.id);
}

/**
 * Export plugin as default.
 */
export default plugin;
