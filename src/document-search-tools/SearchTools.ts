export namespace SearchReplace {
  export interface ISearchReplacePlugin {
    setQuery: (query: IQuery) => void;

    next: () => void;
    prev: () => void;
    all: () => void;

    replace?: () => void;
    replaceAll?: () => void;
  }

  export interface IMatch {
    start: number;
    end: number;
  }

  /**
   * A query value for the search.
   */
  export interface IQuery {
    /** The query value */
    value: string;
    /** RegEx query or exact match */
    isRegEx: boolean;
    /** match case or ignore case */
    ignoreCase: boolean;
  }

  /**
   * Queries a string and returns an array of offset ranges for the matches.
   *
   * @param query The query to be executed.
   * @param target The text to be queried.
   */
  export function getMatchRanges(query: IQuery, target: string): IMatch[] {
    let matches: IMatch[] = [];

    // Return if query has no value
    if (query.value.length === 0) {
      return matches;
    }

    // Assemble RegEx object parameters from IQuery values.
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
