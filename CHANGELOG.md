# @robinvdbroeck/factory-girl

## 6.0.0-beta.1

### Patch Changes

- 94cf4fb: Add `(() => Promise<T>)` to the `Definition<T>` type to support async generators like `factory.assoc()`
- 17cea58: Fix package.json exports and publishing configuration

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

### Minor Changes

- Improved internal type safety:
  - `Adapter` interface methods `build`, `save`, and `destroy` are now generic over the model type `M` (defaults to `any`), allowing type information to flow through adapter calls.
  - `Hook` type narrows `options` parameter from `any` to `MaybeReadonlyArray<BuildOptions> | undefined`.
  - `Factory` internal methods (`build`, `create`, `buildMany`, `createMany`) are now generic over the model type.

### Patch Changes

- ffb9dae: Update README to reflect v6 API changes.
