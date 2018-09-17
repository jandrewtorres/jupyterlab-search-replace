import { VDomModel } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ApplicationShell } from '@jupyterlab/application';
import { SearchToolsFactoryProducer } from './SearchToolsFactory';
import { SearchReplace } from './document-search-tools/SearchTools';

export class SearchToolsModel extends VDomModel {
  _currentWidget: SearchToolsModel.ICurrentWidget;
  _docManager: IDocumentManager;
  _notebookTracker: INotebookTracker;

  constructor(options: SearchToolsModel.IOptions) {
    super();
    this._docManager = options.docManager;
    this._notebookTracker = options.notebookTracker;
    this.currentWidget = options.shell.currentWidget;
    options.shell.currentChanged.connect((sender, args) => {
      this.currentWidget = options.shell.currentWidget;
    });
  }

  set currentWidget(widget: Widget | null) {
    const type = this._docManager.contextForWidget(widget).contentsModel.type;
    console.log(type);
    if (type === 'notebook') {
      this._currentWidget = {
        widget: widget as NotebookPanel,
        plugin: SearchToolsFactoryProducer.getFactory(type).createSearchTools(
          widget as NotebookPanel
        )
      };
    }
  }

  set query(query: SearchReplace.IQuery) {
    this._currentWidget.plugin.setQuery(query);
  }
}

export namespace SearchToolsModel {
  export interface IOptions {
    shell: ApplicationShell;
    docManager: IDocumentManager;
    notebookTracker: INotebookTracker;
  }

  export interface ICurrentWidget {
    widget: Widget;
    plugin: SearchReplace.ISearchReplacePlugin;
  }
}
