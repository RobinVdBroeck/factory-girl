import DummyModel from './DummyModel.js';

export default class DummyMongooseModel extends DummyModel {
  async remove() {
    this.removeCalled = true;
    return this;
  }
}
