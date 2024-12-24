## v6.0.0

Fork from the original https://github.com/simonexmachina/factory-girl.

Contains the following changes:

- Drop support for node < 18.12.0, making the minimum required version 18.12.0.



## v4.0.0

Total rewrite. Should preserve backwards compatibility except as noted below.

- `assocBuild` is now `assocAttr`
- `assocBuildMany`
- `FactoryGirl.setAdapter` now takes an array of `factoryNames` for convenience

## v3.0.0

- `afterBuild` now takes `attrs` as the second parameter. If you need the `options` they can be
  accessed from the receiver in `this.options`.
