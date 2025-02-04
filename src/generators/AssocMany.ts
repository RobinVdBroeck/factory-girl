import FactoryGirl from '../FactoryGirl.js';
import { Attributes, BuildOptions } from '../types.js';

export default class AssocMany {
  constructor(private factoryGirl: FactoryGirl) {}

  async generate(
    name: string,
    num: number,
    key: string | null = null,
    attrs: Attributes<any> = {},
    buildOptions: BuildOptions = {},
  ): Promise<any[]> {
    const models = await this.factoryGirl.createMany(
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
