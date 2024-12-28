## v6.0.0

Forked from https://github.com/simonexmachina/factory-girl.

Contains the following public changes:

- Drop support for node < 18.12.0, making the minimum required version 18.12.0.
- Dropped babel-runtime requirement.
- Dropped UMD and browser bundles. If you need browser support, use https://unpkg.com/.
- Dropped bower support.
- Removed all but the default and object adapter. If you are using on the previous existing
  onces, just implement a class extending DefaultAdapter yourself, which is
  trivial.

And the following internal changes:

- Add CI
- Bump serveral dev dependencies
- Move from a custom build script to rollup
- Added prettier for formatting

## v4.0.0

Total rewrite. Should preserve backwards compatibility except as noted below.

- `assocBuild` is now `assocAttr`
- `assocBuildMany`
- `FactoryGirl.setAdapter` now takes an array of `factoryNames` for convenience

## v3.0.0

- `afterBuild` now takes `attrs` as the second parameter. If you need the `options` they can be
  accessed from the receiver in `this.options`.
