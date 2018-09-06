import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookSearcher } from './NotebookSearcher';
import { SearchTools } from '../SearchTools';

export class NotebookSearchTools
  implements SearchTools.IDocumentSearchTools<NotebookPanel> {
  constructor(nbPanel: NotebookPanel) {
    this.searcher = new NotebookSearcher(nbPanel.model.cells);
  }

  set query(query: string) {
    this.searcher.query = query;
    console.log(this.searcher.matches);
  }

  searcher: SearchTools.IDocumentSearcher<NotebookPanel>;
}

export namespace NotebookSearchTools {
  export interface INotebookMatch extends SearchTools.IDocumentMatch {
    cellID: string;
  }
}
