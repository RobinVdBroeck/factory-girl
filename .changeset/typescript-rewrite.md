---
'@robinvdbroeck/factory-girl': major
---

**Full TypeScript rewrite with generated type declarations.**

- All source files rewritten in TypeScript
- Generator class hierarchy (`Assoc`, `Sequence`, `OneOf`, etc.) replaced with methods on the `FactoryGirl` instance
- `DefaultAdapter` is now an `Adapter` interface — code extending the concrete class must implement the interface instead
- See [MIGRATE-V6.md](./MIGRATE-V6.md) for full migration guide
