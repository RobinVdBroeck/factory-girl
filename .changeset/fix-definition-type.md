---
'@robinvdbroeck/factory-girl': patch
---

Add `(() => Promise<T>)` to the `Definition<T>` type to support async generators like `factory.assoc()`
