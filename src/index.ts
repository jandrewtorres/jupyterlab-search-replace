import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the search-replace-notebook-extension extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'search-replace-notebook-extension',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension search-replace-notebook-extension is activated!');
  }
};

export default extension;
