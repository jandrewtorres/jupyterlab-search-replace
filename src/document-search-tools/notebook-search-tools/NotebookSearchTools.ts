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
    this.searcher = new NotebookSearcher(nbPanel.model.cells);
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
              return nbMatch.cellID === cell.model.id;
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
                start: cell.editor.getPositionAt(match.start),
                end: cell.editor.getPositionAt(match.end)
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
        return match.cellID === cell.model.id;
      }
    );
  }

  /*
    // If previous selection index is greater than matches list's size,
    // set selected index to last match in list.
    if (this._selectedIndex > this._matches.matches.length) {
      this._selectedIndex = this._matches.matches.length - 1;
    }

    // Get the cell ID of current selection
    const cellID: string = (this._matches.matches[
      this._selectedIndex
    ] as NotebookSearchTools.INotebookMatch).cellID;

    // Get the cell
    const cell: Cell = find(this._panel.content.widgets, (cell: Cell) => {
      return cell.model.id === cellID;
    });
    */

  searcher: SearchTools.IDocumentSearcher<NotebookPanel>;
}

export namespace NotebookSearchTools {
  export interface INotebookMatch extends SearchTools.IMatchRange {
    cellID: string;
  }
}
