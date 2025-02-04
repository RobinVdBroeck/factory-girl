import FactoryGirl from '../FactoryGirl.js';

export default class Assoc {
  constructor(private factoryGirl: FactoryGirl) {}

  async generate(name: string, key = null, attrs = {}, buildOptions = {}) {
    const model = await this.factoryGirl.create(name, attrs, buildOptions);
    return key ? this.getAttribute(name, model, key) : model;
  }
}
