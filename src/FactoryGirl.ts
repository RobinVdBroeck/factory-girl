import Factory from './Factory.ts';
import type { FactoryOptions } from './Factory.ts';
import DefaultAdapter from './adapters/DefaultAdapter.ts';
import Chance from 'chance';

const chance = new Chance();

// Public type exports
export type Generator<T = any> = () => T;
export type Definition<T = any> = T | Generator<T> | Promise<T> | (() => Promise<T>);
export type Attributes<T = any> = { [P in keyof T]: Definition<T[P]> };
export type MaybeReadonlyArray<T = any> = T | readonly T[];
export type BuildOptions = Record<string, any>;
export type Initializer<T = any, BO = BuildOptions> =
  | Attributes<T>
  | ((buildOptions?: BO) => Attributes<T>)
  | ((buildOptions?: BO) => Promise<Attributes<T>>);
export type Hook<T = any> = (model: any, attrs: T | T[], options: any) => any;

export interface Options<T = any> {
  afterBuild?: Hook<T>;
  afterCreate?: Hook<T>;
}

export interface Adapter {
  build(Model: any, props: Record<string, any>): any;
  save(model: any, Model: any): Promise<any>;
  destroy(model: any, Model: any): Promise<any>;
  get(model: any, attr: string, Model?: any): any;
  set(props: Record<string, any>, model: any, Model?: any): any;
}

export interface FactoryGirlOptions {
  afterBuild?: Hook;
  afterCreate?: Hook;
}

// Sequence state
const sequences: Record<string, number | undefined> = {};

function nextSequenceId(): string {
  let i = 0;
  let id: string;
  do {
    id = `_${i++}`;
  } while (id in sequences);
  return id;
}

export default class FactoryGirl {
  factories: Record<string, Factory> = {};
  options: FactoryGirlOptions = {};
  adapters: Record<string, Adapter> = {};
  created: Set<[Adapter, any]> = new Set();
  defaultAdapter: Adapter;

  // Assigned at runtime by index.ts
  FactoryGirl?: typeof FactoryGirl;

  constructor(options: FactoryGirlOptions = {}) {
    this.defaultAdapter = new DefaultAdapter();
    this.options = options;
  }

  assoc(
    name: string,
    key?: string,
    attrs?: Attributes,
    buildOptions?: BuildOptions
  ): () => Promise<any> {
    return async () => {
      const model = await this.create(name, attrs, buildOptions);
      return key ? this.getAdapter(name).get(model, key) : model;
    };
  }

  assocMany(
    name: string,
    num: number,
    key?: string,
    attrs?: Attributes,
    buildOptions?: BuildOptions
  ): () => Promise<any[]> {
    return async () => {
      const models = await this.createMany(name, num, attrs, buildOptions);
      return key ? models.map((model) => this.getAdapter(name).get(model, key)) : models;
    };
  }

  assocBuild(..._args: any[]): never {
    throw new Error('The assocBuild method has been deprecated, use assocAttrs instead');
  }

  assocBuildMany(..._args: any[]): never {
    throw new Error('The assocBuildMany method has been deprecated, use assocAttrsMany instead');
  }

  assocAttrs(
    name: string,
    key?: string,
    attrs?: Attributes,
    buildOptions?: BuildOptions
  ): () => Promise<any> {
    return async () => {
      const attrsResult = await this.attrs(name, attrs, buildOptions);
      return key ? (attrsResult as Record<string, any>)[key] : attrsResult;
    };
  }

  assocAttrsMany(
    name: string,
    num: number,
    key?: string,
    attrs?: Attributes,
    buildOptions?: BuildOptions
  ): () => Promise<any[]> {
    return async () => {
      if (typeof num !== 'number' || num < 1) {
        throw new Error('Invalid number of items requested');
      }
      const models = await this.attrsMany(name, num, attrs, buildOptions);
      return key ? models.map((model: Record<string, any>) => model[key]) : models;
    };
  }

  seq(id?: string | ((n: number) => any), callback?: (n: number) => any): () => any {
    if (typeof id === 'function') {
      callback = id;
      id = undefined;
    }
    const seqId = id || nextSequenceId();
    // Reserve the ID immediately so subsequent seq() calls get unique IDs
    if (!(seqId in sequences)) {
      sequences[seqId] = 1;
    }
    return () => {
      const next = sequences[seqId] ?? 1;
      sequences[seqId] = next + 1;
      return callback ? callback(next) : next;
    };
  }

  get sequence() {
    return this.seq;
  }

  resetSeq(id?: string | null): void {
    if (!id) {
      for (const key of Object.keys(sequences)) {
        delete sequences[key];
      }
    } else {
      sequences[id] = undefined;
    }
  }

  get resetSequence() {
    return this.resetSeq;
  }

  chance(chanceMethod: string, ...options: any[]): () => any {
    return () => {
      if (typeof (chance as any)[chanceMethod] !== 'function') {
        throw new Error('Invalid chance method requested');
      }
      return (chance as any)[chanceMethod](...options);
    };
  }

  oneOf(possibleValues: any[]): () => Promise<any> {
    return async () => {
      if (!Array.isArray(possibleValues)) {
        throw new Error('Expected an array of possible values');
      }
      if (possibleValues.length < 1) {
        throw new Error('Empty array passed for possible values');
      }
      const value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
      return typeof value === 'function' ? value() : value;
    };
  }

  define<T = any>(
    name: string,
    Model: any,
    initializer: Initializer<Partial<T>>,
    options: Options<T> = {}
  ): Factory {
    if (this.getFactory(name, false)) {
      throw new Error(`Factory ${name} already defined`);
    }
    const factory = (this.factories[name] = new Factory(Model, initializer, options));
    return factory;
  }

  extend(
    parent: string,
    name: string,
    childInitializer: Initializer,
    options: FactoryOptions = {}
  ): Factory {
    if (this.getFactory(name, false)) {
      throw new Error(`Factory ${name} already defined`);
    }
    const parentFactory = this.getFactory(parent, true)!;
    const Model = options.model || parentFactory.Model;
    let jointInitializer: Initializer;

    function resolveInitializer(initializer: Initializer, buildOptions: BuildOptions) {
      return typeof initializer === 'function' ? initializer(buildOptions) : initializer;
    }

    if (typeof parentFactory.initializer === 'function' || typeof childInitializer === 'function') {
      jointInitializer = function initializer(buildOptions: BuildOptions = {}) {
        return Object.assign(
          {},
          resolveInitializer(parentFactory.initializer, buildOptions),
          resolveInitializer(childInitializer, buildOptions)
        );
      };
    } else {
      jointInitializer = Object.assign({}, parentFactory.initializer, childInitializer);
    }

    const factory = (this.factories[name] = new Factory(Model, jointInitializer, options));
    return factory;
  }

  async attrs<T = any>(
    name: string,
    attrs?: Attributes<Partial<T>>,
    buildOptions?: BuildOptions
  ): Promise<T> {
    return this.getFactory(name)!.attrs(attrs, buildOptions) as Promise<T>;
  }

  async build<T = any>(
    name: string,
    attrs?: Attributes<Partial<T>>,
    buildOptions: BuildOptions = {}
  ): Promise<T> {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)!
      .build(adapter, attrs || {}, buildOptions)
      .then((model: any) =>
        this.options.afterBuild ? this.options.afterBuild(model, attrs, buildOptions) : model
      );
  }

  async create<T = any>(
    name: string,
    attrs?: Attributes<Partial<T>>,
    buildOptions: BuildOptions = {}
  ): Promise<T> {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)!
      .create(adapter, attrs, buildOptions)
      .then((createdModel: any) => this.addToCreatedList(adapter, createdModel))
      .then((model: any) =>
        this.options.afterCreate ? this.options.afterCreate(model, attrs, buildOptions) : model
      );
  }

  attrsMany<T = any>(
    name: string,
    num: number,
    attrs?: MaybeReadonlyArray<Attributes<Partial<T>>>,
    buildOptions?: BuildOptions | readonly BuildOptions[]
  ): Promise<T[]> {
    return this.getFactory(name)!.attrsMany(num, attrs, buildOptions) as Promise<T[]>;
  }

  async buildMany<T = any>(
    name: string,
    num: number,
    attrs?: MaybeReadonlyArray<Attributes<Partial<T>>>,
    buildOptions?: MaybeReadonlyArray<BuildOptions>
  ): Promise<T[]> {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)!
      .buildMany(adapter, num, attrs, buildOptions)
      .then((models: any[]) =>
        this.options.afterBuild
          ? Promise.all(models.map((model) => this.options.afterBuild!(model, attrs, buildOptions)))
          : models
      );
  }

  async createMany<T>(
    name: string,
    num: number,
    attrs?: MaybeReadonlyArray<Attributes<Partial<T>>>,
    buildOptions?: MaybeReadonlyArray<BuildOptions>
  ): Promise<T[]>;
  async createMany<T>(
    name: string,
    attrs?: ReadonlyArray<Attributes<Partial<T>>>,
    buildOptions?: MaybeReadonlyArray<BuildOptions>
  ): Promise<T[]>;
  async createMany(
    name: string,
    numOrAttrs?: number | readonly Record<string, any>[],
    attrs?: MaybeReadonlyArray<Record<string, any>>,
    buildOptions?: MaybeReadonlyArray<BuildOptions>
  ): Promise<any[]> {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)!
      .createMany(adapter, numOrAttrs ?? 0, attrs, buildOptions)
      .then((models: any[]) => this.addToCreatedList(adapter, models))
      .then((models: any[]) =>
        this.options.afterCreate
          ? Promise.all(
              models.map((model) => this.options.afterCreate!(model, attrs, buildOptions))
            )
          : models
      );
  }

  getFactory(name: string, throwError?: true): Factory;
  getFactory(name: string, throwError: false): Factory | undefined;
  getFactory(name: string, throwError = true): Factory | undefined {
    if (!this.factories[name] && throwError) {
      throw new Error(`Invalid factory '${name}' requested`);
    }
    return this.factories[name];
  }

  withOptions(options: FactoryGirlOptions, merge = false): void {
    this.options = merge ? { ...this.options, ...options } : options;
  }

  getAdapter(factory?: string): Adapter {
    return factory ? this.adapters[factory] || this.defaultAdapter : this.defaultAdapter;
  }

  addToCreatedList(adapter: Adapter, models: any | any[]): any {
    if (!Array.isArray(models)) {
      this.created.add([adapter, models]);
    } else {
      for (const model of models) {
        this.created.add([adapter, model]);
      }
    }
    return models;
  }

  cleanUp(): Promise<void> {
    const createdArray: [Adapter, any][] = [];
    for (const c of this.created) {
      createdArray.push(c);
    }
    const promise = createdArray.reduce<Promise<void>>(
      (prev, [adapter, model]) => prev.then(() => adapter.destroy(model, model.constructor)),
      Promise.resolve()
    );
    this.created.clear();
    this.resetSeq();
    return promise;
  }

  setAdapter(adapter: Adapter, factoryNames?: string | string[] | null): Adapter {
    if (!factoryNames) {
      this.defaultAdapter = adapter;
    } else {
      factoryNames = Array.isArray(factoryNames) ? factoryNames : [factoryNames];
      factoryNames.forEach((name) => {
        this.adapters[name] = adapter;
      });
    }
    return adapter;
  }
}
