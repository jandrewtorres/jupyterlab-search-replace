import { VDomModel } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';
import { ApplicationShell } from '@jupyterlab/application';
import { INotebookTracker } from '@jupyterlab/notebook/lib/tracker';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';

export class FinderModel extends VDomModel {
  notebookTracker: INotebookTracker;
  shell: ApplicationShell;
  currentWidget: Widget;
  results: any = {};

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
    if (!this.currentWidget) {
      return;
    }
    let nb = this.currentWidget as NotebookPanel;
    let cellsWidgets = nb.content.widgets as ReadonlyArray<Cell>;
    cellsWidgets.forEach((cell, cellIndex) => {
      let re = new RegExp(searchString, 'g');
      let match;
      let indices = [];

      do {
        match = re.exec(cell.editor.model.value.text);
        if (match) {
          indices.push(match.index);
        }
      } while (match);

      if (indices.length > 0) {
        cell.editor.focus();
        cell.editor.setSelections(
          indices.map(i => {
            return {
              start: cell.editor.getPositionAt(i),
              end: cell.editor.getPositionAt(i + searchString.length)
            };
          })
        );
      }

      this.results[cellIndex] = indices;
    });
  }

  findAll(searchString: string): any {
    console.log('find all');
  }
}
