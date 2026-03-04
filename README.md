# factory-girl

`factory-girl` is a factory library for [Node.js](http://nodejs.org/) inspired by [Factory\_girl](http://github.com/thoughtbot/factory_girl). It works asynchronously and supports associations and the use of functions for generating attributes.

## Installation

```bash
npm install @robinvdbroeck/factory-girl
```

Requires Node.js >= 22.12.

## Usage

Refer to [the tutorial](docs/tutorial.md) for a gentle introduction of building a simple
user factory.

Here's the crash course:

```javascript
import { factory } from '@robinvdbroeck/factory-girl';
import User from '../models/user';

factory.define('user', User, {
  username: 'Bob',
  score: 50,
});

factory.build('user').then(user => {
  console.log(user); // => User {username: 'Bob', score: 50}
});
```

## Defining Factories

Define factories using the `factory.define()` method.

For example:

```javascript
// Using objects as initializer
factory.define('product', Product, {
  // use sequences to generate values sequentially
  id: factory.sequence('Product.id', (n) => `product_${n}`),
  // use functions to compute some complex value
  launchDate: () => new Date(),
  // return a promise to populate data asynchronously
  asyncData: () => fetch('some/resource'),
});
factory.define('user', User, {
  // seq is an alias for sequence
  email: factory.seq('User.email', (n) => `user${n}@ymail.com`),

  // use the chance(http://chancejs.com/) library to generate real-life like data
  about: factory.chance('sentence'),

  // use assoc to associate with other models
  profileImage: factory.assoc('profile_image', '_id'),

  // or assocMany to associate multiple models
  addresses: factory.assocMany('address', 2, '_id'),

  // use assocAttrs to embed models that are not persisted
  creditCardNumber: factory.assocAttrs('credit_card', 'number', {type: 'masterCard'}),

  // use assocAttrs or assocAttrsMany to embed plain json objects
  twitterDetails: factory.assocAttrs('twitter_details'),
});
```

```javascript
// Using functions as initializer
factory.define('account', Account, buildOptions => {
  let attrs = {
    confirmed: false,
    confirmedAt: null
  };

  // use build options to modify the returned object
  if (buildOptions.confirmedUser) {
    attrs.confirmed = true;
    attrs.confirmedAt = new Date();
  }
  return attrs;
});

// buildOptions can be passed while requesting an object
factory.build('account', {}, {confirmed: true});
```

### Options

Options can be provided when you define a factory:

```javascript
factory.define('user', User, { foo: 'bar' }, options);
```

Alternatively you can set options for the factory that will get applied for all model-factories:

```javascript
factory.withOptions(options);
```

Currently the supported options are:

#### `afterBuild: function(model, attrs, buildOptions)`

Provides a function that is called after the model is built.
The function should return the instance or a Promise for the instance.

#### `afterCreate: function(model, attrs, buildOptions)`

Provides a function that is called after a new model instance is saved. The function
should return the instance or throw an error. For asynchronous functions, it should return
a promise that resolves with the instance or rejects with the error.

```javascript
factory.define('user', User, {foo: 'bar'}, {
  afterBuild: (model, attrs, buildOptions) => {
    return doSomethingAsync(model).then(() => {
      doWhateverElse(model);
      return model;
    });
  },
  afterCreate: (model, attrs, buildOptions) => {
    modify(model);
    if ('something' === 'wrong') {
      throw new Error;
    }
    maybeLog('something');
    return model;
  }
});
```

### Extending Factories

You can extend a factory using `#extend`:

```js
factory.define('user', User, { username: 'Bob', expired: false });
factory.extend('user', 'expiredUser', { expired: true });
factory.build('expiredUser').then(user => {
  console.log(user); // => User { username: 'Bob', expired: true });
});
```

### `#extend(parent, name, initializer, options = {})`

The `#extend` method takes the same options as `#define` except you 
can provide a different `Model` using `options.model`.

## Using Factories

### Factory#attrs

Generates and returns model attributes as an object hash instead of the model instance.
This may be useful where you need a JSON representation of the model e.g. mocking an API
response.

```javascript
factory.attrs('post').then(postAttrs => {
  // postAttrs is a json representation of the Post model
});

factory.attrs('post', {title: 'Foo', content: 'Bar'}).then(postAttrs => {
  // builds post json object and overrides title and content
});

factory.attrs('post', {title: 'Foo'}, {hasComments: true}).then(postAttrs => {
  // builds post json object
  // overrides title
  // invokes the initializer function with buildOptions of {hasComments: true}
});
```

You can use `Factory#attrsMany` to generate a set of model attributes

```javascript
factory.attrsMany('post', 5, [{title: 'foo1'}, {title: 'foo2'}]).then(postAttrsArray => {
  // postAttrsArray is an array of 5 post json objects
  debug(postAttrsArray);
});
```

### Factory#build

Builds a new model instance that is not persisted.

```javascript
factory.build('post').then(post => {
  // post is a Post instance that is not persisted
});
```

The `buildMany` version builds an array of model instances.

```javascript
factory.buildMany('post', 5).then(postsArray => {
  // postsArray is an array of 5 Post instances
});
```

Similar to `Factory#attrs`, you can pass attributes to override or buildOptions.

### Factory#create(name, attrs, buildOptions)

Builds a new model instance that is persisted.

```js
factory.create('post').then(post => {
  // post is a saved Post instance
});
```

### Factory#createMany(name, num, attrs, buildOptions = {})

The createMany version creates an array of model instances.

```javascript
factory.createMany('post', 5).then(postsArray => {
  // postsArray is an array of 5 Post saved instances
});
```

Similar to `Factory#attrs` and `Factory#build`, you can pass `attrs` to override and
`buildOptions`. If you pass an array of `attrs` then each element of the array will be
used as the attrs for a each model created.

### Factory#createMany(name, attrs, buildOptions = {})

If you can pass an array of `attrs` then you can omit `num` and the length of the array
will be used.

### Factory#cleanUp

Destroys all of the created models. This is done using the adapter's `destroy` method.
It might be useful to clear all created models before each test or testSuite.

## Adapters

Adapters handle model construction, persistence, and destruction. An adapter can be
registered as the default (used for all models) or scoped to specific factory names.

```javascript
import { factory, DefaultAdapter } from '@robinvdbroeck/factory-girl';

// set as the default adapter
factory.setAdapter(new DefaultAdapter());

// or only for one model-factory
factory.setAdapter(new DefaultAdapter(), 'factory-name');
```

### Custom Adapters

You can write a custom adapter to integrate with any ORM. An adapter is a plain class
implementing five methods:

| Method | Signature | Description |
|---|---|---|
| `build` | `(Model, props)` | Construct a new (unsaved) model instance |
| `save` | `(model, Model)` | Persist the instance, return a Promise resolving to the model |
| `destroy` | `(model, Model)` | Delete the instance, return a Promise |
| `get` | `(model, attr, Model)` | Read a single attribute from the instance |
| `set` | `(props, model, Model)` | Write attributes onto the instance |

Example adapter for a Sequelize-style ORM where `Model.build(props)` constructs instances
and attribute access is via plain properties:

```js
class SequelizeAdapter {
  build(Model, props) {
    return Model.build(props);
  }
  async save(model) {
    return model.save();
  }
  async destroy(model) {
    return model.destroy();
  }
  get(model, attr) {
    return model[attr];
  }
  set(props, model) {
    return model.set(props);
  }
}

factory.setAdapter(new SequelizeAdapter());
```

### DefaultAdapter

`DefaultAdapter` is the built-in adapter. It expects your model class to follow this
interface:

- `new Model(props)` — constructor receives the attributes object
- `model.save()` — persists the instance, may return a Promise
- `model.destroy()` — deletes the instance, may return a Promise
- `model.get(attr)` — returns the value of an attribute
- `model.set(props)` — sets attributes on the instance

```js
import { factory, DefaultAdapter } from '@robinvdbroeck/factory-girl';

class User {
  constructor(attrs) {
    Object.assign(this, attrs);
  }
  save() {
    // persist the model, return a Promise if async
  }
  destroy() {
    // delete the model, return a Promise if async
  }
  get(attr) {
    return this[attr];
  }
  set(props) {
    Object.assign(this, props);
  }
}

factory.setAdapter(new DefaultAdapter());
factory.define('user', User, { username: 'Bob' });
```

## Creating new Factories

You can create multiple independent factory instances with different settings:

```javascript
import { factory } from '@robinvdbroeck/factory-girl';

const anotherFactory = new factory.FactoryGirl();
anotherFactory.setAdapter(new DefaultAdapter());
```

## History

This module started out as a fork of
[factory-lady](https://github.com/petejkim/factory-lady), but the fork deviated quite a
bit. Version 4.0 was a complete rewrite with thanks to @chetanism.

## License

Copyright (c) 2016 Chetan Verma.  
Copyright (c) 2014 Simon Wade.
Copyright (c) 2011 Peter Jihoon Kim.  

This software is licensed under the [MIT
License](http://github.com/aexmachina/factory-girl/raw/master/LICENSE.txt).
