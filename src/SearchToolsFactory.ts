import { NotebookPanel } from '@jupyterlab/notebook';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { SearchReplace } from './document-search-tools/SearchTools';
import { NotebookSearchReplacePlugin } from './document-search-tools/notebook-search-tools/NotebookSearchTools';
import { Widget } from '@phosphor/widgets';

export interface ISearchToolsFactory {
  createSearchTools(document: Widget): SearchReplace.ISearchReplacePlugin;
}

export class NotebookSearchToolsFactory implements ISearchToolsFactory {
  createSearchTools(document: IDocumentWidget): NotebookSearchReplacePlugin {
    return new NotebookSearchReplacePlugin(document as NotebookPanel);
  }
}

export class SearchToolsFactoryProducer {
  static getFactory(type: string): ISearchToolsFactory | null {
    let factory;
    switch (type) {
      case 'notebook':
        factory = new NotebookSearchToolsFactory();
        break;
      default:
        factory = null;
    }
    return factory;
  }
}
