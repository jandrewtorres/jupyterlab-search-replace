import { ISignal } from '@phosphor/signaling';
import { IDocumentWidget } from '@jupyterlab/docregistry';

export namespace SearchTools {
  export interface IDocumentSearchTools<T extends IDocumentWidget> {
    searcher: IDocumentSearcher<T>;
    query: string;
  }

  export interface IDocumentSearcher<T extends IDocumentWidget> {
    query: string;
    matches: IDocumentMatch[];
    changed: ISignal<this, void>;
  }

  export interface IDocumentMatch {
    documentType: string;
    start: number;
    end: number;
  }
}
