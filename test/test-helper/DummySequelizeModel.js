import DummyModel from './DummyModel.js';

export default class DummySequelizeModel extends DummyModel {
  static build(props) {
    const model = new DummySequelizeModel();
    model.set(props);
    return model;
  }
}
