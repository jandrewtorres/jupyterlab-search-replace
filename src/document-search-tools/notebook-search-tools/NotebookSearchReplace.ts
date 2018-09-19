import { SearchReplace } from '../SearchReplace';
import { each } from '@phosphor/algorithm';
import { Cell } from '@jupyterlab/cells';
import { NotebookPanel } from '@jupyterlab/notebook';
import IMatch = SearchReplace.IMatch;
import IQuery = SearchReplace.IQuery;
import { CodeEditor } from '@jupyterlab/codeeditor';
import IRange = CodeEditor.IRange;
import getMatchRanges = SearchReplace.getMatchRanges;
import ISearchReplacePlugin = SearchReplace.ISearchReplacePlugin;

export class NotebookSearchReplacePlugin implements ISearchReplacePlugin {
  constructor(nbPanel: NotebookPanel) {
    this._nbPanel = nbPanel;
    this._matches = [];
    this._selection = null;

    this._connectToNotebookChangeSignals();
  }

  setQuery(query: SearchReplace.IQuery): void {
    this._query = query;

    this._updateMatches();
    this.next();
  }

  next(): void {
    const matches = this._matches;

    // Clear all previous selections
    this._clearSelections();

    // Do nothing if no matches. TODO: disable buttons if no matches
    if (!this._hasMatches()) {
      return;
    }

    if (this._selection == null) {
      this._select(matches[0]);
      return;
    }

    this._select(this._getNextMatch());
    this._nbPanel.content.mode = 'command';
  }

  private _getNextMatch(): NotebookMatch {
    return this._matches[
      (this._matches.indexOf(this._selection) + 1) % this._matches.length
    ];
  }

  prev(): void {
    let matches = this._matches;

    // Clear all previous selections
    this._clearSelections();

    // Do nothing if no matches. TODO: disable buttons if no matches
    if (!this._hasMatches()) {
      return;
    }

    if (this._selection == null) {
      this._select(matches[matches.length - 1]);
      return;
    }

    this._select(this._getPreviousMatch());
  }

  private _getPreviousMatch() {
    return this._matches[
      this._matches.indexOf(this._selection) === 0
        ? this._matches.length - 1
        : this._matches.indexOf(this._selection) - 1
    ];
  }

  all(): void {
    // Clear all previous selections.
    this._clearSelections();

    // Do nothing if no matches. TODO: disable buttons if no matches
    if (!this._hasMatches()) {
      return;
    }

    // Select all matches.
    each(this._matches, (match: NotebookMatch) => {
      let editor = match.cell.editorWidget.editor;

      // Get previously selected and
      let selections: CodeEditor.IRange[];
      selections = [
        {
          start: editor.getPositionAt(match.start),
          end: editor.getPositionAt(match.end)
        }
      ].concat(...editor.getSelections());

      // Select the match's cell and set selections.
      this._nbPanel.content.select(match.cell);
      editor.setSelections(selections);
    });
  }

  replace(replaceValue: string): void {
    this._clearSelections();

    let editorValue = this._selection.cell.editorWidget.editor.model.value;
    let selectionIndex = this._matches.indexOf(this._selection);
    let selectionLength = this._selection.end - this._selection.start;

    // Replace. Set _isReplacing to true while changing editor value so it
    // it does not trigger _updateMatches.
    this._isReplacing = true;
    editorValue.remove(this._selection.start, this._selection.end);
    editorValue.insert(this._selection.start, replaceValue);
    this._isReplacing = false;

    // Remove the replaced match.
    this._matches.splice(selectionIndex, selectionLength);

    if (this._hasMatches()) {
      this.next();
    }
  }

  replaceAll(replaceValue: string): void {
    console.log('replaceAll');
  }

  private _connectToNotebookChangeSignals() {
    // Connect to cell list changes. ex. ('add', 'remove', ...)
    this._nbPanel.model.cells.changed.connect((sender, args) => {
      this._updateMatches();
    });

    // Connect to cell model value changes.
    each(this._cells(), (cell: Cell) => {
      cell.model.value.changed.connect((sender, args) => {
        if (!this._isReplacing) {
          this._updateMatches();
        }
      });
    });
  }

  private _updateMatches() {
    this._matches = [];

    if (this._query == null) {
      return;
    }

    if (this._query.value.length === 0) {
      return;
    }

    each(this._cells(), (cell: Cell) => {
      each(
        getMatchRanges(this._query, cell.model.value.text),
        (match: IMatch) => {
          this._matches.push(new NotebookMatch(cell, match.start, match.end));
        }
      );
    });
    console.log('update matches: ' + this._matches);
  }

  private _clearSelections(): void {
    // Deselect all cells in notebook.
    this._nbPanel.content.deselectAll();

    // Remove selections from all cells in notebook;
    each(this._cells(), (cell: Cell) => {
      cell.editor.setSelections([]);
    });
  }

  private _select(match: NotebookMatch): void {
    if (match == null) {
      console.log('selecting null');
      this._selection = null;
      return;
    }
    console.log('selecting match @ index: ' + this._matches.indexOf(match));
    this._selection = match;

    let range: IRange = {
      start: match.cell.editorWidget.editor.getPositionAt(match.start),
      end: match.cell.editorWidget.editor.getPositionAt(match.end)
    };

    // Select the match in the cell
    match.cell.editorWidget.editor.setSelection(range);
  }

  private _cells(): ReadonlyArray<Cell> {
    return this._nbPanel.content.widgets;
  }

  private _hasMatches(): boolean {
    return this._matches.length !== 0;
  }

  private _nbPanel: NotebookPanel;
  private _query: IQuery;
  private _matches: NotebookMatch[];
  private _selection: NotebookMatch;
  private _isReplacing: boolean = false;
}

export class NotebookMatch implements IMatch {
  readonly cell: Cell;
  readonly start: number;
  readonly end: number;

  constructor(cell: Cell, start: number, end: number) {
    this.cell = cell;
    this.start = start;
    this.end = end;
  }
}
