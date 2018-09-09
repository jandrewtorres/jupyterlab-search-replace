import { IObservableList } from '@jupyterlab/observables';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { each, find } from '@phosphor/algorithm';
import { ISignal, Signal } from '@phosphor/signaling';
import { NotebookPanel } from '@jupyterlab/notebook';
import { SearchTools } from '../SearchTools';
import { NotebookSearchTools } from './NotebookSearchTools';
import INotebookMatch = NotebookSearchTools.INotebookMatch;
import IDocumentQuery = SearchTools.IDocumentQuery;
import { CodeEditor } from '@jupyterlab/codeeditor';

/**
 * A NotebookSearcher wraps a NotebookPanel and allows it to be
 * queried (IDocumentQuery) for matches (IDocumentMatches).
 *
 * The query may be set using the 'query' property, and the matches may be
 * obtained using the 'matches' property;
 *
 * Upon changes to the notebook matches, the 'changed' property will
 * emit a signal to connected listeners.
 *
 * Matches change (or may have been changed) because:
 * - the query was set
 * - a cell's model value changed (user typed in editor...)
 * - the cell list changed (ex. add cell, remove cell)
 */
export class NotebookSearcher
  implements SearchTools.IDocumentSearcher<NotebookPanel> {
  /**
   * Constructor
   * @param nbPanel - the wrapped panel to be searched.
   */
  constructor(nbPanel: NotebookPanel) {
    this._nbPanel = nbPanel;

    // Create list of searchable cells.
    each(this._nbPanel.content.widgets, (cell: Cell, index: number) => {
      this._addCellSearcher(index, cell);
    });

    // Watch for cell list changes (ex. 'add' or 'remove' cell from list)
    this._nbPanel.model.cells.changed.connect((sender, args) => {
      this._onCellListChanged(args);
    });
  }

  /**
   * Setting the query will update the matches property
   * @param query
   */
  set query(query: IDocumentQuery) {
    // Set the query for each cell to update matches.
    each(this._cells, (cell: CellSearcher) => {
      cell.query = query;
    });
    // Notify observers that matches changed
    this._changed.emit(void 0);
  }

  /**
   * Accessor for 'changed' signal, which notifies connected observers when the
   * notebook's matches have changed / updated.
   */
  get changed() {
    return this._changed;
  }

  /**
   * Accessor for the notebook's matches.
   */
  get matches(): SearchTools.IDocumentMatches {
    let matches: INotebookMatch[] = [];

    // Extract matches from each cell
    each(this._cells, (cell: CellSearcher) => {
      if (cell.matches.length > 0) {
        matches = matches.concat(cell.matches);
      }
    });

    return {
      documentType: 'notebook',
      matches
    };
  }

  /**
   * Inserts a CellSearcher and registers a listener to handle cell changes
   *
   * @param newIndex - the index to insert the new cell at
   * @param newCell - the new cell to insert at the new index
   * @private
   */
  private _addCellSearcher(newIndex: number, newCell: Cell) {
    const cellSearcher = new CellSearcher(newCell);
    this._cells.splice(newIndex, 0, cellSearcher);

    // Listen for changes to cell value / matches.
    cellSearcher.changed.connect((cell, args) => {
      this._onCellChanged(cell);
    });
  }

  /**
   * Removes a CellSearcher.
   *
   * @param oldIndex
   * @private
   */
  private _removeCellSearcher(oldIndex: number) {
    this._cells.splice(oldIndex, 1);
  }

  /**
   * Helper function that returns the corresponding Cell for a given ICellModel.
   * @param model
   * @private
   */
  private _getCellFromModel(model: ICellModel) {
    return find(this._nbPanel.content.widgets, (cell: Cell) => {
      return model.id === cell.model.id;
    });
  }

  /**
   * Handles changes to cell list ('add', 'remove', ... ).
   * @param args - observable list IChangedArgs<ICellModel>
   * @private
   */
  private _onCellListChanged(args: IObservableList.IChangedArgs<ICellModel>) {
    switch (args.type) {
      case 'add':
        this._addCellSearcher(
          args.newIndex,
          this._getCellFromModel(args.newValues[0])
        );
        break;
      case 'remove':
        this._removeCellSearcher(args.oldIndex);
        break;
      default:
        console.log(
          'error: NotebookSearcher._onCellListChanged: ' +
            args.type +
            ' has no handler'
        );
    }
    this._changed.emit(void 0);
  }

  /**
   * Notifies listeners that the cell value/matches have changed.
   * @param cell
   * @private
   */
  private _onCellChanged(cell: CellSearcher) {
    this._changed.emit(void 0);
  }

  private _nbPanel: NotebookPanel;
  private _cells: CellSearcher[] = [];
  private _changed = new Signal<this, void>(this);
}

/**
 * A CellSearcher wraps a Cell and provides matches for that cell.
 * When a cell's value changes, a CellSearcher will emit a signal to notify
 * observers of the changes.
 *
 * Setting the query property will update the matches property.
 */
export class CellSearcher {
  /**
   * Constructor
   * @param cell - the target cell to be wrapped.
   */
  constructor(cell: Cell) {
    this._cell = cell;

    // Listen for cell value changes.
    this._cell.model.value.changed.connect((sender, args) => {
      this._onCellValueChanged();
    });
  }

  set query(query: IDocumentQuery) {
    this._query = query;
    this._updateMatches();
  }

  get changed(): ISignal<this, void> {
    return this._changed;
  }

  get matches(): INotebookMatch[] {
    return this._matches;
  }

  private _updateMatches(): void {
    this._matches = SearchTools.search(
      this._query,
      this._cell.model.value.text
    ).map(
      (range: CodeEditor.IRange): INotebookMatch => {
        return { cell: this._cell, range: range };
      }
    );
  }

  /**
   * Handle cell value changes. Update match list and notify observers.
   * @private
   */
  private _onCellValueChanged() {
    this._updateMatches();
    this._changed.emit(void 0);
  }

  private _cell: Cell;
  private _query: IDocumentQuery;
  private _matches: INotebookMatch[] = [];
  private _changed = new Signal<this, void>(this);
}
