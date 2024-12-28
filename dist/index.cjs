'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Chance = require('chance');

/* eslint-disable no-underscore-dangle */
function asyncPopulate(target, source) {
  if (typeof target !== 'object') {
    return Promise.reject(new Error('Invalid target passed'));
  }
  if (typeof source !== 'object') {
    return Promise.reject(new Error('Invalid source passed'));
  }

  const promises = Object.keys(source).map((attr) => {
    let promise;
    if (Array.isArray(source[attr])) {
      target[attr] = [];
      promise = asyncPopulate(target[attr], source[attr]);
    } else if (source[attr] === null || source[attr] === undefined) {
      target[attr] = source[attr];
    } else if (isPlainObject(source[attr])) {
      target[attr] = target[attr] || {};
      promise = asyncPopulate(target[attr], source[attr]);
    } else if (typeof source[attr] === 'function') {
      promise = Promise.resolve(source[attr]()).then((v) => {
        target[attr] = v;
      });
    } else {
      promise = Promise.resolve(source[attr]).then((v) => {
        target[attr] = v;
      });
    }
    return promise;
  });
  return Promise.all(promises);
}
/* eslint-enable no-underscore-dangle */

const objectProto = Object.getPrototypeOf({});
function isPlainObject(o) {
  return Object.getPrototypeOf(o) === objectProto;
}

class Factory {
  name = null;
  Model = null;
  initializer = null;
  options = {};

  constructor(Model, initializer, options = {}) {
    if (!Model) {
      throw new Error('Invalid Model constructor passed to the factory');
    }
    if (
      (typeof initializer !== 'object' && typeof initializer !== 'function') ||
      !initializer
    ) {
      throw new Error('Invalid initializer passed to the factory');
    }

    this.Model = Model;
    this.initializer = initializer;
    this.options = { ...this.options, ...options };
  }

  getFactoryAttrs(buildOptions = {}) {
    let attrs;
    if (typeof this.initializer === 'function') {
      attrs = this.initializer(buildOptions);
    } else {
      attrs = { ...this.initializer };
    }
    return Promise.resolve(attrs);
  }

  async attrs(extraAttrs = {}, buildOptions = {}) {
    const factoryAttrs = await this.getFactoryAttrs(buildOptions);
    const modelAttrs = {};

    const filteredAttrs = Object.keys(factoryAttrs).reduce((attrs, name) => {
      if (!extraAttrs.hasOwnProperty(name)) attrs[name] = factoryAttrs[name];
      return attrs;
    }, {});

    await asyncPopulate(modelAttrs, filteredAttrs);
    await asyncPopulate(modelAttrs, extraAttrs);

    return modelAttrs;
  }

  async build(adapter, extraAttrs = {}, buildOptions = {}) {
    const modelAttrs = await this.attrs(extraAttrs, buildOptions);
    const model = adapter.build(this.Model, modelAttrs);
    return this.options.afterBuild
      ? this.options.afterBuild(model, extraAttrs, buildOptions)
      : model;
  }

  async create(adapter, attrs = {}, buildOptions = {}) {
    const model = await this.build(adapter, attrs, buildOptions);
    return adapter
      .save(model, this.Model)
      .then((savedModel) =>
        this.options.afterCreate
          ? this.options.afterCreate(savedModel, attrs, buildOptions)
          : savedModel,
      );
  }

  attrsMany(num, attrsArray = [], buildOptionsArray = []) {
    let attrObject = null;
    let buildOptionsObject = null;

    if (typeof attrsArray === 'object' && !Array.isArray(attrsArray)) {
      attrObject = attrsArray;
      attrsArray = [];
    }
    if (
      typeof buildOptionsArray === 'object' &&
      !Array.isArray(buildOptionsArray)
    ) {
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
    attrsArray.length = buildOptionsArray.length = num;
    const models = [];
    for (let i = 0; i < num; i++) {
      models[i] = this.attrs(
        attrObject || attrsArray[i] || {},
        buildOptionsObject || buildOptionsArray[i] || {},
      );
    }
    return Promise.all(models);
  }

  async buildMany(
    adapter,
    num,
    attrsArray = [],
    buildOptionsArray = [],
    buildCallbacks = true,
  ) {
    const attrs = await this.attrsMany(num, attrsArray, buildOptionsArray);
    const models = attrs.map((attr) => adapter.build(this.Model, attr));
    return Promise.all(models).then((builtModels) =>
      this.options.afterBuild && buildCallbacks
        ? Promise.all(
            builtModels.map((builtModel) =>
              this.options.afterBuild(
                builtModel,
                attrsArray,
                buildOptionsArray,
              ),
            ),
          )
        : builtModels,
    );
  }

  async createMany(adapter, num, attrsArray = [], buildOptionsArray = []) {
    if (Array.isArray(num)) {
      buildOptionsArray = attrsArray;
      attrsArray = num;
      num = attrsArray.length;
    }
    const models = await this.buildMany(
      adapter,
      num,
      attrsArray,
      buildOptionsArray,
    );
    const savedModels = models.map((model) => adapter.save(model, this.Model));
    return Promise.all(savedModels).then((createdModels) =>
      this.options.afterCreate
        ? Promise.all(
            createdModels.map((createdModel) =>
              this.options.afterCreate(
                createdModel,
                attrsArray,
                buildOptionsArray,
              ),
            ),
          )
        : createdModels,
    );
  }
}

class Generator {
  constructor(factoryGirl) {
    if (!factoryGirl) {
      throw new Error('No FactoryGirl instance provided');
    }
    this.factoryGirl = factoryGirl;
  }

  generate() {
    throw new Error('Override this method to generate a value');
  }

  getAttribute(name, model, key) {
    return this.factoryGirl.getAdapter(name).get(model, key);
  }
}

class Sequence extends Generator {
  static sequences = {};

  static reset(id = null) {
    if (!id) {
      Sequence.sequences = {};
    } else {
      Sequence.sequences[id] = undefined;
    }
  }

  generate(id = null, callback = null) {
    if (typeof id === 'function') {
      callback = id;
      id = null;
    }
    id = id || this.id || (this.id = generateId());
    Sequence.sequences[id] = Sequence.sequences[id] || 1;
    const next = Sequence.sequences[id]++;
    return callback ? callback(next) : next;
  }
}

function generateId() {
  let id;
  let i = 0;
  do {
    id = `_${i++}`;
  } while (id in Sequence.sequences);
  return id;
}

class Assoc extends Generator {
  async generate(name, key = null, attrs = {}, buildOptions = {}) {
    const model = await this.factoryGirl.create(name, attrs, buildOptions);
    return key ? this.getAttribute(name, model, key) : model;
  }
}

class AssocAttrs extends Generator {
  async generate(name, key = null, attrs = {}, buildOptions = {}) {
    const model = await this.factoryGirl.attrs(name, attrs, buildOptions);
    return key ? this.getAttribute(name, model, key) : model;
  }
}

class AssocMany extends Generator {
  async generate(name, num, key = null, attrs = {}, buildOptions = {}) {
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
}

class AssocAttrsMany extends Generator {
  async generate(name, num, key = null, attrs = {}, buildOptions = {}) {
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
}

const chance = new Chance();

class ChanceGenerator extends Generator {
  generate(chanceMethod, ...options) {
    if (typeof chance[chanceMethod] !== 'function') {
      throw new Error('Invalid chance method requested');
    }
    return chance[chanceMethod](...options);
  }
}

class OneOf extends Generator {
  async generate(possibleValues) {
    if (!Array.isArray(possibleValues)) {
      throw new Error('Expected an array of possible values');
    }

    if (possibleValues.length < 1) {
      throw new Error('Empty array passed for possible values');
    }

    const size = possibleValues.length;
    const randomIndex = Math.floor(Math.random() * size);
    const value = possibleValues[randomIndex];
    return typeof value === 'function' ? value() : value;
  }
}

/* eslint-disable no-unused-vars */
class DefaultAdapter {
  build(Model, props) {
    return new Model(props);
  }
  async save(model, Model) {
    return Promise.resolve(model.save()).then(() => model);
  }
  async destroy(model, Model) {
    return Promise.resolve(model.destroy()).then(() => model);
  }
  get(model, attr, Model) {
    return model.get(attr);
  }
  set(props, model, Model) {
    return model.set(props);
  }
}

class FactoryGirl {
  factories = {};
  options = {};
  adapters = {};
  created = new Set();

  constructor(options = {}) {
    this.assoc = generatorThunk(this, Assoc);
    this.assocMany = generatorThunk(this, AssocMany);
    this.assocBuild = deprecate('assocBuild', 'assocAttrs');
    this.assocBuildMany = deprecate('assocBuildMany', 'assocAttrsMany');
    this.assocAttrs = generatorThunk(this, AssocAttrs);
    this.assocAttrsMany = generatorThunk(this, AssocAttrsMany);
    this.seq = this.sequence = (...args) =>
      generatorThunk(this, Sequence)(...args);
    this.resetSeq = this.resetSequence = (id) => {
      Sequence.reset(id);
    };
    this.chance = generatorThunk(this, ChanceGenerator);
    this.oneOf = generatorThunk(this, OneOf);

    this.defaultAdapter = new DefaultAdapter();
    this.options = options;
  }

  define(name, Model, initializer, options = {}) {
    if (this.getFactory(name, false)) {
      throw new Error(`Factory ${name} already defined`);
    }
    const factory = (this.factories[name] = new Factory(
      Model,
      initializer,
      options,
    ));
    return factory;
  }

  extend(parent, name, childInitializer, options = {}) {
    if (this.getFactory(name, false)) {
      throw new Error(`Factory ${name} already defined`);
    }
    const parentFactory = this.getFactory(parent, true);
    const Model = options.model || parentFactory.Model;
    let jointInitializer;

    function resolveInitializer(initializer, buildOptions) {
      return typeof initializer === 'function'
        ? initializer(buildOptions)
        : initializer;
    }

    if (
      typeof parentFactory.initializer === 'function' ||
      typeof childInitializer === 'function'
    ) {
      jointInitializer = function initializer(buildOptions = {}) {
        return Object.assign(
          {},
          resolveInitializer(parentFactory.initializer, buildOptions),
          resolveInitializer(childInitializer, buildOptions),
        );
      };
    } else {
      jointInitializer = Object.assign(
        {},
        parentFactory.initializer,
        childInitializer,
      );
    }

    const factory = (this.factories[name] = new Factory(
      Model,
      jointInitializer,
      options,
    ));
    return factory;
  }

  async attrs(name, attrs, buildOptions = {}) {
    return this.getFactory(name).attrs(attrs, buildOptions);
  }

  async build(name, attrs = {}, buildOptions = {}) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)
      .build(adapter, attrs, buildOptions)
      .then((model) =>
        this.options.afterBuild
          ? this.options.afterBuild(model, attrs, buildOptions)
          : model,
      );
  }

  async create(name, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)
      .create(adapter, attrs, buildOptions)
      .then((createdModel) => this.addToCreatedList(adapter, createdModel))
      .then((model) =>
        this.options.afterCreate
          ? this.options.afterCreate(model, attrs, buildOptions)
          : model,
      );
  }

  attrsMany(name, num, attrs, buildOptions = {}) {
    return this.getFactory(name).attrsMany(num, attrs, buildOptions);
  }

  async buildMany(name, num, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)
      .buildMany(adapter, num, attrs, buildOptions)
      .then((models) =>
        this.options.afterBuild
          ? Promise.all(
              models.map((model) =>
                this.options.afterBuild(model, attrs, buildOptions),
              ),
            )
          : models,
      );
  }

  async createMany(name, num, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name);
    return this.getFactory(name)
      .createMany(adapter, num, attrs, buildOptions)
      .then((models) => this.addToCreatedList(adapter, models))
      .then((models) =>
        this.options.afterCreate
          ? Promise.all(
              models.map((model) =>
                this.options.afterCreate(model, attrs, buildOptions),
              ),
            )
          : models,
      );
  }

  getFactory(name, throwError = true) {
    if (!this.factories[name] && throwError) {
      throw new Error(`Invalid factory '${name}' requested`);
    }
    return this.factories[name];
  }

  withOptions(options, merge = false) {
    this.options = merge ? { ...this.options, ...options } : options;
  }

  getAdapter(factory) {
    return factory
      ? this.adapters[factory] || this.defaultAdapter
      : this.defaultAdapter;
  }

  addToCreatedList(adapter, models) {
    if (!Array.isArray(models)) {
      this.created.add([adapter, models]);
    } else {
      for (const model of models) {
        this.created.add([adapter, model]);
      }
    }
    return models;
  }

  cleanUp() {
    const createdArray = [];
    for (const c of this.created) {
      createdArray.push(c);
    }
    const promise = createdArray.reduce(
      (prev, [adapter, model]) =>
        prev.then(() => adapter.destroy(model, model.constructor)),
      Promise.resolve(),
    );
    this.created.clear();
    this.resetSeq();
    return promise;
  }

  setAdapter(adapter, factoryNames = null) {
    if (!factoryNames) {
      this.defaultAdapter = adapter;
    } else {
      factoryNames = Array.isArray(factoryNames)
        ? factoryNames
        : [factoryNames];
      factoryNames.forEach((name) => {
        this.adapters[name] = adapter;
      });
    }
    return adapter;
  }
}

function generatorThunk(factoryGirl, SomeGenerator) {
  const generator = new SomeGenerator(factoryGirl);
  return (...args) =>
    () =>
      generator.generate(...args);
}

function deprecate(method, see) {
  return () => {
    throw new Error(
      `The ${method} method has been deprecated, use ${see} instead`,
    );
  };
}

/* eslint-disable no-unused-vars */
class ObjectAdapter extends DefaultAdapter {
  build(Model, props) {
    const model = new Model();
    this.set(props, model, Model);
    return model;
  }
  async save(model, Model) {
    return model;
  }
  async destroy(model, Model) {
    return model;
  }
  get(model, attr, Model) {
    return model[attr];
  }
  set(props, model, Model) {
    return Object.assign(model, props);
  }
}

/* eslint-disable no-unused-vars */
class BookshelfAdapter extends DefaultAdapter {
  save(doc, Model) {
    return doc.save(null, { method: 'insert' });
  }
}

/* eslint-disable no-unused-vars */
class MongooseAdapter extends DefaultAdapter {
  async destroy(model, Model) {
    return model.remove();
  }
}

/* eslint-disable no-unused-vars */
class SequelizeAdapter extends DefaultAdapter {
  build(Model, props) {
    return Model.build(props);
  }
}

/* eslint-disable no-unused-vars */
class ReduxORMAdapter extends DefaultAdapter {
  constructor(session) {
    super();
    this.session = session;
  }

  build(modelName, props) {
    return this.session[modelName].create(props);
  }

  get(model, attr) {
    return model[attr];
  }

  async save(model, Model) {
    return model;
  }

  async destroy(model, Model) {
    return Promise.resolve(model.delete()).then(() => true);
  }
}

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

exports.BookshelfAdapter = BookshelfAdapter;
exports.DefaultAdapter = DefaultAdapter;
exports.MongooseAdapter = MongooseAdapter;
exports.ObjectAdapter = ObjectAdapter;
exports.ReduxORMAdapter = ReduxORMAdapter;
exports.SequelizeAdapter = SequelizeAdapter;
exports.default = factory;
exports.factory = factory;
//# sourceMappingURL=index.cjs.map
