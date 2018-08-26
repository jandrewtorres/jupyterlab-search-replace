import { VDomModel } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { CodeEditor } from '@jupyterlab/codeeditor';
import IRange = CodeEditor.IRange;
import { IDocumentManager } from '@jupyterlab/docmanager';
import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ApplicationShell } from '@jupyterlab/application';
import { FinderToolsFactoryProducer } from './FinderToolsFactory';

export class FinderToolsModel extends VDomModel {
  _currentWidget: FinderToolsModel.ICurrentWidget<any>;

  _docManager: IDocumentManager;
  _notebookTracker: INotebookTracker;
  _shell: ApplicationShell;

  constructor(options: FinderToolsModel.IOptions) {
    super();
    this._docManager = options.docManager;
    this._notebookTracker = options.notebookTracker;
    this._shell = options.shell;

    this.currentWidget = this._shell.currentWidget;

    this._shell.currentChanged.connect((sender, args) => {
      this.currentWidget = this._shell.currentWidget;
    });
  }

  set currentWidget(widget: Widget | null) {
    const type = this._docManager.contextForWidget(widget).contentsModel.type;
    if (type === 'notebook') {
      this._currentWidget = {
        widget: widget as NotebookPanel,
        tools: FinderToolsFactoryProducer.getFactory(type).createFinderTools(
          widget
        )
      };
    }
    console.log(this._currentWidget);
  }

  setQueryString(value: string) {
    this._currentWidget.tools.matchFinder.updateMatches(value);
  }
}

export namespace FinderToolsModel {
  export interface IOptions {
    shell: ApplicationShell;
    docManager: IDocumentManager;
    notebookTracker: INotebookTracker;
  }

  export interface ICurrentWidget<T> {
    widget: T;
    tools: FinderToolsModel.IFinderTools<any, any>;
  }

  export interface IMatchFinder<T extends Widget, U extends IRange> {
    getNextMatch(): U;
    getPreviousMatch(): U;
    updateMatches(searchString: string): void;
  }

  export interface IMatchSelector<T extends Widget, U extends IRange> {
    selectNext(): void;
    selectPrevious(): void;
    selectAll(): void;
    clearSelections(): void;
    currentSelections: U[];
  }

  export interface IMatchReplacer<T extends Widget, U extends IRange> {
    replaceSelections(selections: U, replaceString: string): void;
  }

  export interface IFinderTools<T extends Widget, U extends IRange> {
    matchFinder: IMatchFinder<T, U>;
    matchSelector: IMatchSelector<T, U>;
    matchReplacer: IMatchReplacer<T, U>;
    widget: T;
  }
}
