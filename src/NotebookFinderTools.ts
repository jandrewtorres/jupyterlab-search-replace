import { NotebookPanel } from '@jupyterlab/notebook';
import { each } from '@phosphor/algorithm';
import { Cell, ICellModel } from '@jupyterlab/cells';
import { IObservableList } from '@jupyterlab/observables';
import { ISignal, Signal } from '@phosphor/signaling';
import { CodeEditor } from '@jupyterlab/codeeditor';
import IRange = CodeEditor.IRange;
import { FinderToolsModel } from './FinderToolsModel';

export class NotebookFinderTools
  implements FinderToolsModel.IFinderTools<NotebookPanel, INotebookMatch> {
  private _cellList: CellWithMatches[] = [];

  constructor(nbPanel: NotebookPanel) {
    // Create CellWithMatches list from Cell list.
    each(nbPanel.content.widgets, (cell: Cell) => {
      this._cellList.push(new CellWithMatches(cell));
    });

    // Watch for cell list changes like add and remove cell.
    nbPanel.model.cells.changed.connect((sender, args) => {
      this._onCellListChanged(args);
    });
  }

  _onCellListChanged(args: IObservableList.IChangedArgs<ICellModel>) {
    if (args.type === 'add') {
      this._cellList.splice(
        args.newIndex,
        0,
        new CellWithMatches({ model: args.newValues[0] })
      );
    } else if (args.type === 'remove') {
      this._cellList.splice(args.oldIndex, 1);
    }
  }

  matchFinder: FinderToolsModel.IMatchFinder<NotebookPanel, INotebookMatch>;
  matchReplacer: FinderToolsModel.IMatchReplacer<NotebookPanel, INotebookMatch>;
  matchSelector: FinderToolsModel.IMatchSelector<NotebookPanel, INotebookMatch>;
  widget: NotebookPanel;
}

export class CellWithMatches extends Cell {
  constructor(options: Cell.IOptions) {
    super(options);
    this.model.value.changed.connect((sender, args) => {
      this._updateMatches(args.value.toString());
    });
  }

  get matchesChanged(): ISignal<this, IRange[]> {
    return this._matchesChanged;
  }

  private _updateMatches(searchString: string): void {
    this._matches = [];
    if (searchString.length === 0) {
      return;
    }
    let re = new RegExp(searchString, 'g');
    let match;
    do {
      match = re.exec(this.editor.model.value.text);
      if (match) {
        this._matches.push({
          start: this.editor.getPositionAt(match.index),
          end: this.editor.getPositionAt(match.index + searchString.length)
        });
      }
    } while (match);

    this._matchesChanged.emit(this._matches);
  }

  private _matches: IRange[] = [];
  private _matchesChanged = new Signal<this, IRange[]>(this);
}

export class NotebookMatchFinder
  implements FinderToolsModel.IMatchFinder<NotebookPanel, INotebookMatch> {
  getNextMatch(): INotebookMatch {
    return undefined;
  }

  getPreviousMatch(): INotebookMatch {
    return undefined;
  }

  updateMatches(searchString: string): void {
    return;
  }
}

export class NotebookMatchReplacer
  implements FinderToolsModel.IMatchReplacer<NotebookPanel, INotebookMatch> {
  replaceSelections(selections: INotebookMatch, replaceString: string): void {
    return;
  }
}

export class NotebookMatchSelector
  implements FinderToolsModel.IMatchSelector<NotebookPanel, INotebookMatch> {
  currentSelections: INotebookMatch[];
  widget: NotebookPanel;

  clearSelections(): void {
    return;
  }

  selectAll(): void {
    return;
  }

  selectNext(): void {
    return;
  }

  selectPrevious(): void {
    return;
  }
}

export interface INotebookMatch extends IRange {
  cellID: string;
}
