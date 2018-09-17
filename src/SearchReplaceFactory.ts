import { NotebookPanel } from '@jupyterlab/notebook';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { SearchReplace } from './document-search-tools/SearchReplace';
import { NotebookSearchReplacePlugin } from './document-search-tools/notebook-search-tools/NotebookSearchReplace';
import { Widget } from '@phosphor/widgets';

export interface ISearchReplaceFactory {
  createSearchReplace(document: Widget): SearchReplace.ISearchReplacePlugin;
}

export class NotebookSearchReplaceFactory implements ISearchReplaceFactory {
  createSearchReplace(document: IDocumentWidget): NotebookSearchReplacePlugin {
    return new NotebookSearchReplacePlugin(document as NotebookPanel);
  }
}

export class SearchReplaceFactoryProducer {
  static getFactory(type: string): ISearchReplaceFactory | null {
    let factory;
    switch (type) {
      case 'notebook':
        factory = new NotebookSearchReplaceFactory();
        break;
      default:
        factory = null;
    }
    return factory;
  }
}
