import { ISignal } from '@phosphor/signaling';
import { IDocumentWidget } from '@jupyterlab/docregistry';
import { CodeEditor } from '@jupyterlab/codeeditor';

export namespace SearchTools {
  export interface IDocumentSearchTools<T extends IDocumentWidget> {
    searcher: IDocumentSearcher<T>;
    query: IDocumentQuery;
  }

  export interface IDocumentSearcher<T extends IDocumentWidget> {
    // search(query: IDocumentQuery): IDocumentMatches;
    query: IDocumentQuery;
    matches: IDocumentMatches;
    changed: ISignal<this, void>;
  }

  export interface IDocumentMatches {
    documentType: string;
    matches: SearchTools.IDocumentMatch[];
  }

  export interface IDocumentMatch {
    range: CodeEditor.IRange;
  }

  /**
   * A query that can be executed on a document.
   */
  export interface IDocumentQuery {
    /** The query value */
    value: string;
    /** RegEx query or exact match */
    isRegEx: boolean;
    /** match case or ignore case */
    ignoreCase: boolean;
  }

  /**
   * Queries a string and returns an array of matches.
   *
   * @param query The query to be executed.
   * @param text The text to be queried.
   */
  export function search(
    query: IDocumentQuery,
    target: string
  ): CodeEditor.IRange[] {
    let matches: CodeEditor.IRange[] = [];

    // Return if query has no value
    if (query.value.length === 0) {
      return matches;
    }

    // Assemble RegEx object parameters from IDocumentQuery values.
    //   - pattern: represents actual query value as either regex or literal.
    //   - flags: 'g' always set, i indicates ignoreCase.
    const pattern: string = query.isRegEx
      ? query.value
      : query.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const flags: string = 'g' + (query.ignoreCase ? 'i' : '');

    // Find all match offset ranges.
    let re = new RegExp(pattern, flags);
    let match;
    do {
      match = re.exec(target);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + query.value.length
        });
      }
    } while (match);

    // Return the match offset ranges.
    return matches;
  }
}
