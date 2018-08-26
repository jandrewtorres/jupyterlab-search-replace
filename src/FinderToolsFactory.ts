import { NotebookPanel } from '@jupyterlab/notebook';
import { FinderToolsModel } from './FinderToolsModel';
import { INotebookMatch, NotebookFinderTools } from './NotebookFinderTools';

import { CodeEditor } from '@jupyterlab/codeeditor';
import IRange = CodeEditor.IRange;
import { Widget } from '@phosphor/widgets';

export interface IFinderToolsFactory<T extends Widget, U extends IRange> {
  createFinderTools(widget: Widget): FinderToolsModel.IFinderTools<T, U>;
}

export class NotebookFinderToolsFactory
  implements IFinderToolsFactory<NotebookPanel, INotebookMatch> {
  createFinderTools(widget: Widget): NotebookFinderTools {
    return new NotebookFinderTools(widget as NotebookPanel);
  }
}

export class FinderToolsFactoryProducer {
  static getFactory(type: string): IFinderToolsFactory<any, any> | null {
    let factory;
    switch (type) {
      case 'notebook':
        factory = new NotebookFinderToolsFactory();
        break;
      default:
        factory = null;
    }
    return factory;
  }
}
