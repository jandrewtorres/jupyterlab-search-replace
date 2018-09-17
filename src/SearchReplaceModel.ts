import { VDomModel } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ApplicationShell } from '@jupyterlab/application';
import { SearchReplaceFactoryProducer } from './SearchReplaceFactory';
import { SearchReplace } from './document-search-tools/SearchReplace';

export class SearchReplaceModel extends VDomModel {
  _currentWidget: SearchReplaceModel.ICurrentWidget;
  _docManager: IDocumentManager;
  _notebookTracker: INotebookTracker;

  constructor(options: SearchReplaceModel.IOptions) {
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
        plugin: SearchReplaceFactoryProducer.getFactory(
          type
        ).createSearchReplace(widget as NotebookPanel)
      };
    }
  }

  set query(query: SearchReplace.IQuery) {
    this._currentWidget.plugin.setQuery(query);
  }
}

export namespace SearchReplaceModel {
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
