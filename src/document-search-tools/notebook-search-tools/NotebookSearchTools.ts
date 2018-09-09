import { NotebookPanel } from '@jupyterlab/notebook';
import { NotebookSearcher } from './NotebookSearcher';
import { Cell } from '@jupyterlab/cells';
import {
  toArray,
  filter,
  find,
  map,
  each,
  IIterator
} from '@phosphor/algorithm';
import { SearchTools } from '../SearchTools';

export class NotebookSearchTools
  implements SearchTools.IDocumentSearchTools<NotebookPanel> {
  private _matches: SearchTools.IDocumentMatches;
  private _panel: NotebookPanel;

  constructor(nbPanel: NotebookPanel) {
    this.searcher = new NotebookSearcher(nbPanel);
    this.searcher.changed.connect((sender, args) => {
      this._updateMatches();
    });
    this._panel = nbPanel;
  }

  set query(query: SearchTools.IDocumentQuery) {
    this.searcher.query = query;
    this._matches = this.searcher.matches;
    this._updateMatches();
  }

  private _clearSelections(): void {
    this._panel.content.deselectAll();
    each(this._panel.content.widgets, (cell: Cell) => {
      cell.editor.setSelections([]);
    });
  }

  private _updateMatches() {
    if (this._panel.content.mode === 'edit') {
      this._panel.content.mode = 'command';
    }
    this._clearSelections();

    if (!this._matches) {
      return;
    }
    if (!this._matches.matches) {
      return;
    }

    let cellsWithMatches = filter(
      this._panel.content.widgets as ReadonlyArray<Cell>,
      (cell: Cell) => {
        return (
          undefined !==
          find(
            this._matches.matches as NotebookSearchTools.INotebookMatch[],
            nbMatch => {
              return nbMatch.cell.model.id === cell.model.id;
            }
          )
        );
      }
    );

    each(cellsWithMatches, (cell: Cell) => {
      this._panel.content.select(cell);

      cell.editorWidget.editor.setSelections(
        toArray(
          map(
            this._matchesForCell(cell),
            (match: NotebookSearchTools.INotebookMatch) => {
              return {
                start: match.range.start,
                end: match.range.end
              };
            }
          )
        )
      );
    });
  }

  private _matchesForCell(
    cell: Cell
  ): IIterator<NotebookSearchTools.INotebookMatch> {
    return filter(
      this._matches.matches as NotebookSearchTools.INotebookMatch[],
      (match: NotebookSearchTools.INotebookMatch) => {
        return match.cell.model.id === cell.model.id;
      }
    );
  }

  searcher: SearchTools.IDocumentSearcher<NotebookPanel>;
}

export namespace NotebookSearchTools {
  export interface INotebookMatch extends SearchTools.IDocumentMatch {
    cell: Cell;
  }
}
