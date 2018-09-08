import { ISignal } from '@phosphor/signaling';
import { IDocumentWidget } from '@jupyterlab/docregistry';

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
    matches: IMatchRange[];
  }

  /**
   * Offset values for a match.
   */
  export interface IMatchRange {
    start: number;
    end: number;
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
  export function search(query: IDocumentQuery, text: string): IMatchRange[] {
    let matches: IMatchRange[] = [];

    // Return if query has no value
    if (query.value.length === 0) {
      return matches;
    }

    // Assemble RegEx pattern and flags
    const pattern: string = query.isRegEx
      ? query.value
      : query.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const flags: string = 'g' + (query.ignoreCase ? 'i' : '');

    // Get offset range for all matches
    let re = new RegExp(pattern, flags);
    let match;
    do {
      match = re.exec(text);
      if (match) {
        matches.push({
          start: match.index,
          end: match.index + query.value.length
        });
      }
    } while (match);

    return matches;
  }
}
