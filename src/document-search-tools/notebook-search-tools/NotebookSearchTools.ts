import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookSearcher } from './NotebookSearcher';
import { SearchTools } from '../SearchTools';

export class NotebookSearchTools
  implements SearchTools.IDocumentSearchTools<NotebookPanel> {
  constructor(nbPanel: NotebookPanel) {
    this.searcher = new NotebookSearcher(nbPanel.model.cells);
  }

  set query(query: SearchTools.IDocumentQuery) {
    this.searcher.query = query;
    console.log(this.searcher.matches);
  }

  searcher: SearchTools.IDocumentSearcher<NotebookPanel>;
}

export namespace NotebookSearchTools {
  export interface INotebookMatch extends SearchTools.IMatchRange {
    cellID: string;
  }
}
