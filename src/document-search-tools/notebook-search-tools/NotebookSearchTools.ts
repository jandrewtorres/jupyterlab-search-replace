import { SearchReplace } from '../SearchTools';
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

    if (!this._hasMatches()) {
      return;
    }

    if (!this._selection) {
      this._select(matches[0]);
      console.log(matches[0]);
      return;
    }

    let nextIndex = (matches.indexOf(this._selection) + 1) % matches.length;
    console.log('next index: ' + nextIndex);
    this._select(matches[nextIndex]);
  }

  prev(): void {
    let matches = this._matches;

    // Clear all previous selections
    this._clearSelections();

    if (!this._hasMatches()) {
      return;
    }

    if (!this._selection) {
      this._select(matches[matches.length - 1]);
      return;
    }

    let currIndex = matches.indexOf(this._selection);
    let prevIndex = currIndex === 0 ? matches.length - 1 : currIndex - 1;
    this._select(matches[prevIndex]);
  }

  all(): void {
    // Clear all previous selections
    this._clearSelections();

    if (!this._hasMatches()) {
      return;
    }

    each(this._matches, (match: NotebookMatch) => {
      let editor = match.cell.editorWidget.editor;
      let selections = editor.getSelections().concat({
        start: editor.getPositionAt(match.start),
        end: editor.getPositionAt(match.end)
      });
      this._nbPanel.content.select(match.cell);
      editor.setSelections(selections);
    });
  }

  replace(): void {
    console.log('replace');
  }

  replaceAll(): void {
    console.log('replace');
  }

  private _connectToNotebookChangeSignals() {
    // Connect to cell list changes. ex. ('add', 'remove', ...)
    this._nbPanel.model.cells.changed.connect((sender, args) => {
      this._updateMatches();
    });

    // Connect to cell model value changes.
    each(this._cells(), (cell: Cell) => {
      cell.model.value.changed.connect((sender, args) => {
        this._updateMatches();
      });
    });
  }

  private _updateMatches() {
    this._matches = [];

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

    console.log(this._matches);
  }

  private _clearSelections(): void {
    this._nbPanel.content.deselectAll();
    each(this._cells(), (cell: Cell) => {
      cell.editor.setSelections([]);
    });
  }

  private _select(match: NotebookMatch): void {
    this._selection = match;

    // Select the cell
    this._nbPanel.content.select(match.cell);
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
