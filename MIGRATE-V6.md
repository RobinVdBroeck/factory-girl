# Migrating to v6

## Removed adapters

The following built-in adapters have been removed:

- `BookshelfAdapter`
- `MongooseAdapter`
- `ObjectAdapter`
- `ReduxORMAdapter`
- `SequelizeAdapter`

Only `DefaultAdapter` remains as the built-in adapter.

## What to do

If you were importing a removed adapter, you now need to define it yourself by extending `DefaultAdapter`.

### Before

```js
import { ObjectAdapter } from '@robinvdbroeck/factory-girl';
factory.setAdapter(new ObjectAdapter());
```

### After

```js
import { DefaultAdapter } from '@robinvdbroeck/factory-girl';

class ObjectAdapter extends DefaultAdapter {
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

factory.setAdapter(new ObjectAdapter());
```

### Reference: removed adapter implementations

Below are the original implementations for each removed adapter so you can copy them into your project if needed.

#### BookshelfAdapter

```js
class BookshelfAdapter extends DefaultAdapter {
  save(doc) {
    return doc.save(null, { method: 'insert' });
  }
}
```

#### MongooseAdapter

```js
class MongooseAdapter extends DefaultAdapter {
  async destroy(model) {
    return model.remove();
  }
}
```

#### SequelizeAdapter

```js
class SequelizeAdapter extends DefaultAdapter {
  build(Model, props) {
    return Model.build(props);
  }
}
```

#### ReduxORMAdapter

```js
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

  async save(model) {
    return model;
  }

  async destroy(model) {
    return Promise.resolve(model.delete()).then(() => true);
  }
}
```

#### ObjectAdapter

```js
class ObjectAdapter extends DefaultAdapter {
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
```
