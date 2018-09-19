import { MainAreaWidget } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { NotebookPanel } from '@jupyterlab/notebook';
import { ApplicationShell } from '@jupyterlab/application';
import { SearchReplaceFactoryProducer } from './SearchReplaceFactory';
import { SearchReplace } from './document-search-tools/SearchReplace';
import ISearchReplacePlugin = SearchReplace.ISearchReplacePlugin;
import IQuery = SearchReplace.IQuery;

export class SearchReplacePluginManager implements ISearchReplacePlugin {
  constructor(options: SearchReplacePluginManager.IOptions) {
    this._docManager = options.docManager;

    options.shell.currentChanged.connect((sender, args) => {
      this._onCurrentChanged(options.shell.currentWidget as MainAreaWidget);
    });
  }

  private _onCurrentChanged(widget: MainAreaWidget | undefined | null) {
    widget.revealed.then(() => {
      const context = this._docManager.contextForWidget(widget);
      const type = context != null ? context.contentsModel.type : null;
      if (type === 'notebook') {
        this._currentWidget = {
          widget: widget as NotebookPanel,
          plugin: SearchReplaceFactoryProducer.getFactory(
            type
          ).createSearchReplace(widget as NotebookPanel)
        };
      } else {
        this._currentWidget = null;
        return;
      }

      this.setQuery = (query: IQuery) => {
        this._currentWidget.plugin.setQuery(query);
      };
      this.all = () => this._currentWidget.plugin.all();
      this.next = () => this._currentWidget.plugin.next();
      this.prev = () => this._currentWidget.plugin.prev();
      this.replace = (val: string) => this._currentWidget.plugin.replace(val);
      this.replaceAll = (val: string) => {
        this._currentWidget.plugin.replaceAll(val);
      };
    });
  }

  private _currentWidget: SearchReplacePluginManager.ICurrentWidget;
  private _docManager: IDocumentManager;

  all: () => void;
  next: () => void;
  prev: () => void;
  replace: (replaceValue: string) => void;
  replaceAll: (replaceValue: string) => void;
  setQuery: (query: SearchReplace.IQuery) => void;
}

export namespace SearchReplacePluginManager {
  export interface IOptions {
    shell: ApplicationShell;
    docManager: IDocumentManager;
  }

  export interface ICurrentWidget {
    widget: MainAreaWidget;
    plugin: SearchReplace.ISearchReplacePlugin;
  }
}
