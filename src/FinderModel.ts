import { VDomModel } from '@jupyterlab/apputils';

export class FinderModel extends VDomModel {
  constructor() {
    super();
  }

  find() {
    console.log('You found me!');
  }
}
