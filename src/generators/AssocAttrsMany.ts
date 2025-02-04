import FactoryGirl from '../FactoryGirl.js';

export default class AssocAttrsMany {
  constructor(private factoryGirl: FactoryGirl) {}

  async generate(
    name: string,
    num: number,
    key = null,
    attrs = {},
    buildOptions = {},
  ) {
    if (typeof num !== 'number' || num < 1) {
      throw new Error('Invalid number of items requested');
    }
    const models = await this.factoryGirl.attrsMany(
      name,
      num,
      attrs,
      buildOptions,
    );
    return key
      ? models.map((model) => this.getAttribute(name, model, key))
      : models;
  }

  private getAttribute(name: string, model: string, key: string) {
    return this.factoryGirl.getAdapter(name).get(model, key);
  }
}
