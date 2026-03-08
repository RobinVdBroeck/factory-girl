---
'@robinvdbroeck/factory-girl': minor
---

**Add `FactoryRegistry` interface for type-safe factory methods.**

Consumers can augment the `FactoryRegistry` interface to get fully typed return values from `build`, `create`, `attrs`, `buildMany`, `createMany`, `attrsMany`, `assoc`, `assocMany`, `assocAttrs`, and `assocAttrsMany`. Unregistered factory names fall back to `any` / `Record<string, any>`, so this is fully backwards-compatible.

```ts
declare module '@robinvdbroeck/factory-girl' {
  interface FactoryRegistry {
    User: { attrs: UserAttrs; model: UserModel };
  }
}

// factory.build('User') now returns Promise<UserModel>
// factory.attrs('User') now returns Promise<UserAttrs>
```
