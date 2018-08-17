import { VDomModel } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { ApplicationShell } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook/lib/tracker';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { IIterator, iter, find, toArray } from '@phosphor/algorithm';
import { CodeEditor } from '@jupyterlab/codeeditor';
import IRange = CodeEditor.IRange;

export class FinderModel extends VDomModel {
  notebookTracker: INotebookTracker;
  shell: ApplicationShell;
  currentWidget: Widget;
  matches: IIterator<IMatch> = iter([]);
  currentMatch: IMatch = null;
  searchString: string = '';

  constructor(shell: ApplicationShell, notebookTracker: INotebookTracker) {
    super();
    this.shell = shell;
    this.notebookTracker = notebookTracker;
    this.currentWidget = shell.currentWidget;
    shell.currentChanged.connect((sender, args) => {
      this.currentWidget = null;
      if (notebookTracker.has(shell.currentWidget)) {
        this.currentWidget = shell.currentWidget;
      }
    });
  }

  find(searchString: string): any {
    if (this.searchString !== searchString) {
      this.searchString = searchString;
      this._updateMatches();
    }
    this._deselectCurrent();
    this.currentMatch = this.matches.next();
    if (!this.currentMatch) {
      this._updateMatches();
      this.currentMatch = this.matches.next();
    }
    this._selectCurrent();
  }

  findAll(searchString: string): any {
    if (this.searchString !== searchString) {
      this.searchString = searchString;
    }
    this._updateMatches();
    this._selectAll();
  }

  _updateMatches(): any {
    if (!this.currentWidget) {
      return;
    }
    this.matches = iter([]);
    let nb = this.currentWidget as NotebookPanel;
    let cellsWidgets = nb.content.widgets as ReadonlyArray<Cell>;
    cellsWidgets.forEach((cell, cellIndex) => {
      let re = new RegExp(this.searchString, 'g');
      let currMatches = [];
      let match;
      do {
        match = re.exec(cell.editor.model.value.text);
        if (match) {
          currMatches.push({
            start: cell.editor.getPositionAt(match.index),
            end: cell.editor.getPositionAt(
              match.index + this.searchString.length
            ),
            cellID: cell.model.id
          });
        }
      } while (match);
      this.matches = iter(toArray(this.matches).concat(currMatches));
    });
  }

  _selectCurrent(): void {
    if (!this.currentMatch) {
      return;
    }
    let matchCell = this._getCurrentMatchCell();

    matchCell.editor.focus();
    matchCell.editor.setSelection(this.currentMatch);
  }

  _deselectCurrent(): void {
    if (!this.currentMatch) {
      return;
    }
    let matchCell = this._getCurrentMatchCell();
    matchCell.editor.setCursorPosition(matchCell.editor.getPositionAt(0));
  }

  _getCurrentMatchCell() {
    return find(
      (this.currentWidget as NotebookPanel).content.widgets,
      (cell: Cell) => {
        return cell.model.id === this.currentMatch.cellID;
      }
    );
  }

  _selectAll(): void {
    this.currentMatch = this.matches.next();
    while (this.currentMatch) {
      this._selectCurrent();
      this.currentMatch = this.matches.next();
    }
  }

  replace(replaceString: string): void {
    let matchCell = this._getCurrentMatchCell();
    matchCell.editor.model.value.remove(
      matchCell.editor.getOffsetAt(this.currentMatch.start),
      matchCell.editor.getOffsetAt(this.currentMatch.end)
    );
    matchCell.editor.model.value.insert(
      matchCell.editor.getOffsetAt(this.currentMatch.start),
      replaceString
    );
    this._updateMatches();
    this._deselectCurrent();
    this.currentMatch = this.matches.next();
    this._selectCurrent();
  }
}

interface IMatch extends IRange {
  readonly cellID: string;
}
