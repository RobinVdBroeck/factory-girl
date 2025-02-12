import { expect, describe, it } from 'vitest';
import asyncPopulate from '../../src/utils/asyncPopulate.js';

describe('asyncPopulate', function () {
  it('returns a promise', function () {
    const asyncPopulateP = asyncPopulate({}, {});
    expect(asyncPopulateP.then).to.be.a('function');
    return expect(asyncPopulateP).to.be.eventually.fulfilled;
  });

  it('throws error if target or source is not an object', function () {
    const targetP = asyncPopulate(undefined, {});
    const sourceP = asyncPopulate({});

    return Promise.all([
      expect(targetP).to.be.eventually.rejected,
      expect(sourceP).to.be.eventually.rejected,
    ]);
  });

  it('populates objects correctly', async function () {
    function Foo() {}
    const source = {
      num: 1,
      nullValue: null,
      undefinedValue: undefined,
      str: 'hello',
      date: new Date(),
      foo: new Foo(),
      funcs: {
        sync: () => 'shouldHaveThisValue',

        async: async () => 'shouldHaveResolvedValue',

        promise: () => Promise.resolve('shouldWorkWithPromises'),
      },
      arrays: {
        simple: [1, 2, 3],
        funcs: [() => 1, async () => 2, () => Promise.resolve(3)],
        nested: [
          1,
          [{ a: 1, b: 2 }, { c: 3, d: 4 }, [{ p: () => 20, q: [6, 7] }]],
        ],
      },
    };

    const target = {};
    await asyncPopulate(target, source);

    expect(target).to.be.eql({
      num: 1,
      nullValue: null,
      undefinedValue: undefined,
      str: 'hello',
      date: source.date,
      foo: source.foo,
      funcs: {
        sync: 'shouldHaveThisValue',
        async: 'shouldHaveResolvedValue',
        promise: 'shouldWorkWithPromises',
      },
      arrays: {
        simple: [1, 2, 3],
        funcs: [1, 2, 3],
        nested: [
          1,
          [
            { a: 1, b: 2 },
            { c: 3, d: 4 },
            [
              {
                p: 20,
                q: [6, 7],
              },
            ],
          ],
        ],
      },
    });
  });

  it('overrides only provided data', async function () {
    const target = {
      x: {
        y: 1,
        z: 3,
      },
      p: [1, 2, 3],
    };
    const source = {
      x: {
        y: () => 'yo',
      },
      p: [4],
    };

    await asyncPopulate(target, source);

    expect(target).to.be.eql({
      x: {
        y: 'yo',
        z: 3,
      },
      p: [4],
    });
  });
});
