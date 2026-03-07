# @robinvdbroeck/factory-girl

## 6.0.0-beta.0

### Major Changes

- 9e5b02b: **ESM-only package, requires Node.js >= 22.12.**

  - CJS build is no longer shipped — `require()` of ESM works natively on Node 22.12+
  - Bower build has been removed
  - Build tooling migrated to tsdown

- 35eeebb: **Remove all built-in adapters except `DefaultAdapter`.**

  The following adapters have been removed: `BookshelfAdapter`, `MongooseAdapter`, `ObjectAdapter`, `ReduxORMAdapter`, and `SequelizeAdapter`.

  If you were using one of these, you can recreate it by implementing the `Adapter` interface. See [MIGRATE-V6.md](./MIGRATE-V6.md) for migration instructions.

- ca26089: **Full TypeScript rewrite with generated type declarations.**

  - All source files rewritten in TypeScript
  - Generator class hierarchy (`Assoc`, `Sequence`, `OneOf`, etc.) replaced with methods on the `FactoryGirl` instance
  - `DefaultAdapter` is now an `Adapter` interface — code extending the concrete class must implement the interface instead
  - See [MIGRATE-V6.md](./MIGRATE-V6.md) for full migration guide

### Patch Changes

- ffb9dae: Update README to reflect v6 API changes.
