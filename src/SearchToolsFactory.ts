import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookSearchTools } from './document-search-tools/notebook-search-tools/NotebookSearchTools';
import { SearchTools } from './document-search-tools/SearchTools';
import { IDocumentWidget } from '@jupyterlab/docregistry';

export interface ISearchToolsFactory<T extends IDocumentWidget> {
  createSearchTools(
    document: IDocumentWidget
  ): SearchTools.IDocumentSearchTools<T>;
}

export class NotebookSearchToolsFactory
  implements ISearchToolsFactory<NotebookPanel> {
  createSearchTools(document: IDocumentWidget): NotebookSearchTools {
    return new NotebookSearchTools(document as NotebookPanel);
  }
}

export class SearchToolsFactoryProducer {
  static getFactory(type: string): ISearchToolsFactory<any> | null {
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
