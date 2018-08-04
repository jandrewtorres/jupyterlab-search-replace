import { IInstanceTracker } from '@jupyterlab/apputils';

import { Token } from '@phosphor/coreutils';

import { Finder } from './Finder';

/* tslint:disable */
/**
 * The console tracker token.
 */
export const IFinderTracker = new Token<IFinderTracker>(
  '@jupyterlab/console:IConsoleTracker'
);
/* tslint:enable */

/**
 * A class that tracks console widgets.
 */
export interface IFinderTracker extends IInstanceTracker<Finder> {}
