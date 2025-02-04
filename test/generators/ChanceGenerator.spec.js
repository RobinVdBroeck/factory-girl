import { describe, it, expect } from 'vitest';
import { expect } from 'chai';
import ChanceGenerator from '../../src/generators/ChanceGenerator.ts';

describe('ChanceGenerator', function () {
  describe('#constructor', function () {
    it('validates the passed chance method', function () {
      function invalidMethod() {
        new ChanceGenerator({}).generate('invalidMethodName');
      }

      function validMethod() {
        new ChanceGenerator({}).generate('bool');
      }

      expect(invalidMethod).to.throw(Error);
      expect(validMethod).to.not.throw(Error);
    });
  });

  describe('#generate', function () {
    it('resolves to a value', async function () {
      const chance = new ChanceGenerator({});
      const val = await chance.generate('bool', { likelihood: 30 });
      expect(val).to.exist;
    });

    it('supports multiple parameters', async function () {
      const chance = new ChanceGenerator({});
      const val = await chance.generate('pickset', ['one', 'two', 'three'], 2);
      expect(val).to.exist;
      expect(val.length).to.equal(2);
    });
  });
});
