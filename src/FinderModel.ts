import { VDomModel } from '@jupyterlab/apputils';
import { IFinderService } from './index';

export class FinderModel extends VDomModel implements IFinderService {
  constructor() {
    super();
  }

  find() {
    console.log('You found me!');
  }
}
