import asyncPopulate from './utils/asyncPopulate.ts';
import type { Adapter, BuildOptions, Initializer, Options } from './FactoryGirl.ts';

export interface FactoryOptions extends Options {
  model?: any;
}

export default class Factory {
  name: string | null = null;
  Model: any;
  initializer: Initializer;
  options: FactoryOptions = {};

  constructor(Model: any, initializer: Initializer, options: FactoryOptions = {}) {
    if (!Model) {
      throw new Error('Invalid Model constructor passed to the factory');
    }
    if ((typeof initializer !== 'object' && typeof initializer !== 'function') || !initializer) {
      throw new Error('Invalid initializer passed to the factory');
    }

    this.Model = Model;
    this.initializer = initializer;
    this.options = { ...this.options, ...options };
  }

  getFactoryAttrs(buildOptions: BuildOptions = {}): Promise<Record<string, any>> {
    let attrs;
    if (typeof this.initializer === 'function') {
      attrs = this.initializer(buildOptions);
    } else {
      attrs = { ...this.initializer };
    }
    return Promise.resolve(attrs);
  }

  async attrs(
    extraAttrs: Record<string, any> = {},
    buildOptions: BuildOptions = {}
  ): Promise<Record<string, any>> {
    const factoryAttrs = await this.getFactoryAttrs(buildOptions);
    const modelAttrs: Record<string, any> = {};

    const filteredAttrs = Object.keys(factoryAttrs).reduce(
      (attrs: Record<string, any>, name: string) => {
        if (!extraAttrs.hasOwnProperty(name)) attrs[name] = factoryAttrs[name];
        return attrs;
      },
      {}
    );

    await asyncPopulate(modelAttrs, filteredAttrs);
    await asyncPopulate(modelAttrs, extraAttrs);

    return modelAttrs;
  }

  async build(
    adapter: Adapter,
    extraAttrs: Record<string, any> = {},
    buildOptions: BuildOptions = {}
  ): Promise<any> {
    const modelAttrs = await this.attrs(extraAttrs, buildOptions);
    const model = adapter.build(this.Model, modelAttrs);
    return this.options.afterBuild
      ? this.options.afterBuild(model, extraAttrs, buildOptions)
      : model;
  }

  async create(
    adapter: Adapter,
    attrs: Record<string, any> = {},
    buildOptions: BuildOptions = {}
  ): Promise<any> {
    const model = await this.build(adapter, attrs, buildOptions);
    return adapter
      .save(model, this.Model)
      .then((savedModel: any) =>
        this.options.afterCreate
          ? this.options.afterCreate(savedModel, attrs, buildOptions)
          : savedModel
      );
  }

  attrsMany(
    num: number,
    attrsArray: readonly Record<string, any>[] | Record<string, any> = [],
    buildOptionsArray: readonly BuildOptions[] | BuildOptions = []
  ): Promise<Record<string, any>[]> {
    let attrObject: Record<string, any> | null = null;
    let buildOptionsObject: BuildOptions | null = null;

    if (typeof attrsArray === 'object' && !Array.isArray(attrsArray)) {
      attrObject = attrsArray;
      attrsArray = [];
    }
    if (typeof buildOptionsArray === 'object' && !Array.isArray(buildOptionsArray)) {
      buildOptionsObject = buildOptionsArray;
      buildOptionsArray = [];
    }
    if (typeof num !== 'number' || num < 1) {
      return Promise.reject(new Error('Invalid number of objects requested'));
    }
    if (!Array.isArray(attrsArray)) {
      return Promise.reject(new Error('Invalid attrsArray passed'));
    }
    if (!Array.isArray(buildOptionsArray)) {
      return Promise.reject(new Error('Invalid buildOptionsArray passed'));
    }
    const models: Promise<Record<string, any>>[] = [];
    for (let i = 0; i < num; i++) {
      models[i] = this.attrs(
        attrObject || (i < attrsArray.length ? attrsArray[i] : undefined) || {},
        buildOptionsObject ||
          (i < buildOptionsArray.length ? buildOptionsArray[i] : undefined) ||
          {}
      );
    }
    return Promise.all(models);
  }

  async buildMany(
    adapter: Adapter,
    num: number,
    attrsArray: readonly Record<string, any>[] | Record<string, any> = [],
    buildOptionsArray: readonly BuildOptions[] | BuildOptions = [],
    buildCallbacks = true
  ): Promise<any[]> {
    const attrs = await this.attrsMany(num, attrsArray, buildOptionsArray);
    const models = attrs.map((attr) => adapter.build(this.Model, attr));
    return Promise.all(models).then((builtModels) =>
      this.options.afterBuild && buildCallbacks
        ? Promise.all(
            builtModels.map((builtModel) =>
              this.options.afterBuild!(builtModel, attrsArray, buildOptionsArray)
            )
          )
        : builtModels
    );
  }

  async createMany(
    adapter: Adapter,
    num: number | readonly Record<string, any>[],
    attrsArray: readonly Record<string, any>[] | Record<string, any> = [],
    buildOptionsArray: readonly BuildOptions[] | BuildOptions = []
  ): Promise<any[]> {
    if (Array.isArray(num)) {
      buildOptionsArray = attrsArray as BuildOptions[];
      attrsArray = num;
      num = attrsArray.length;
    }
    const models = await this.buildMany(adapter, num as number, attrsArray, buildOptionsArray);
    const savedModels = models.map((model) => adapter.save(model, this.Model));
    return Promise.all(savedModels).then((createdModels) =>
      this.options.afterCreate
        ? Promise.all(
            createdModels.map((createdModel) =>
              this.options.afterCreate!(createdModel, attrsArray, buildOptionsArray)
            )
          )
        : createdModels
    );
  }
}
