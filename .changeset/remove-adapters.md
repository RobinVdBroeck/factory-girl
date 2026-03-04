---
"@robinvdbroeck/factory-girl": major
---

**Remove all built-in adapters except `DefaultAdapter`.**

The following adapters have been removed: `BookshelfAdapter`, `MongooseAdapter`, `ObjectAdapter`, `ReduxORMAdapter`, and `SequelizeAdapter`.

If you were using one of these, you can recreate it by implementing the `Adapter` interface. See [MIGRATE-V6.md](./MIGRATE-V6.md) for migration instructions.
