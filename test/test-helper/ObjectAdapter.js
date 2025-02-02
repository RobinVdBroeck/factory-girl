import DefaultAdapter from '../../src/adapters/DefaultAdapter';

/**
 * Adapter that writes to an object
 */
export default class ObjectAdapter extends DefaultAdapter {
  build(Model, props) {
    const model = new Model();
    this.set(props, model, Model);
    return model;
  }
  async save(model) {
    return model;
  }
  async destroy(model) {
    return model;
  }
  get(model, attr) {
    return model[attr];
  }
  set(props, model) {
    return Object.assign(model, props);
  }
}
