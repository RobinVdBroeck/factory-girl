import { describe, it, expect } from 'vitest';
import OneOf from '../../src/generators/OneOf.js';

describe('OneOf', function () {
  describe('#constructor', function () {
    it('can be created', function () {
      const oneOf = new OneOf({});
      expect(oneOf).to.be.instanceof(OneOf);
    });
  });

  describe('#generate', function () {
    it('validates possible values', function () {
      const oneOf = new OneOf({});
      const invalidValuesArrayP = oneOf.generate(23);
      const emptyValuesArrayP = oneOf.generate([]);
      const validValuesArrayP = oneOf.generate([1, 2, 3]);

      return Promise.all([
        expect(invalidValuesArrayP).to.be.eventually.rejected,
        expect(emptyValuesArrayP).to.be.eventually.rejected,
        expect(validValuesArrayP).to.be.eventually.fulfilled,
      ]);
    });

    it('returns a promise', function () {
      const possibleValues = [1, 'two', 'III'];
      const oneOf = new OneOf({});

      const valP = oneOf.generate(possibleValues);
      expect(valP.then).to.be.a('function');
      return expect(valP).to.be.eventually.fulfilled;
    });

    it('always generates one of the passed values', async function () {
      const possibleValues = [1, 'two', 'III'];
      const oneOf = new OneOf({});

      for (let i = 0; i < 5; i++) {
        const aValue = await oneOf.generate(possibleValues);
        expect(possibleValues.indexOf(aValue) > -1).to.be.true;
      }
    });

    it('can accept functions as values', async function () {
      const possibleValues = [() => 23];
      const oneOf = new OneOf({});

      const val = await oneOf.generate(possibleValues);
      expect(val).to.be.equal(23);
    });

    it('can accept async functions as values', async function () {
      const possibleValues = [async () => 23];

      const oneOf = new OneOf({});

      const val = await oneOf.generate(possibleValues);
      expect(val).to.be.equal(23);
    });

    it('can accept functions returning promises as values', async function () {
      const possibleValues = [() => Promise.resolve(23)];
      const oneOf = new OneOf({});

      const val = await oneOf.generate(possibleValues);
      expect(val).to.be.equal(23);
    });

    it('can accept promises as values', async function () {
      const possibleValues = [Promise.resolve(23)];
      const oneOf = new OneOf({});

      const val = await oneOf.generate(possibleValues);
      expect(val).to.be.equal(23);
    });
  });
});
