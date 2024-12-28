import DefaultAdapter from './DefaultAdapter.js';

/* eslint-disable no-unused-vars */
export default class MongooseAdapter extends DefaultAdapter {
  async destroy(model, Model) {
    return model.remove();
  }
}
