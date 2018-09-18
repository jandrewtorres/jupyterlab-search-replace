import { MainAreaWidget, VDomModel } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { NotebookPanel } from '@jupyterlab/notebook';
import { ApplicationShell } from '@jupyterlab/application';
import { SearchReplaceFactoryProducer } from './SearchReplaceFactory';
import { SearchReplace } from './document-search-tools/SearchReplace';

export class SearchReplacePluginManager extends VDomModel {
  constructor(options: SearchReplacePluginManager.IOptions) {
    super();
    this._docManager = options.docManager;

    options.shell.currentChanged.connect((sender, args) => {
      this.currentWidget = options.shell.currentWidget as MainAreaWidget;
    });
  }

  set currentWidget(widget: MainAreaWidget | undefined | null) {
    if (widget == null) {
      this._currentWidget = null;
      return;
    }

    widget.revealed.then(() => {
      const type = this._docManager.contextForWidget(widget).contentsModel.type;
      if (type === 'notebook') {
        this._currentWidget = {
          widget: widget as NotebookPanel,
          plugin: SearchReplaceFactoryProducer.getFactory(
            type
          ).createSearchReplace(widget as NotebookPanel)
        };
      }
    });
  }

  get plugin(): SearchReplace.ISearchReplacePlugin {
    return this._currentWidget.plugin;
  }

  private _currentWidget: SearchReplacePluginManager.ICurrentWidget;
  private _docManager: IDocumentManager;
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
