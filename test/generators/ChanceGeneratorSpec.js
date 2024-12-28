import '../test-helper/testUtils.js';
import ChanceGenerator from '../../src/generators/ChanceGenerator.js';
import { expect } from 'chai';
// import _debug from 'debug';
import asyncFunction from '../test-helper/asyncFunction.js';

// const debug = _debug('ChanceGeneratorSpec');

describe('ChanceGenerator', function () {
  describe('#constructor', function () {
    it('validates the passed chance method', function () {
      /* eslint-disable no-new */
      function invalidMethod() {
        new ChanceGenerator({}).generate('invalidMethodName');
      }

      function validMethod() {
        new ChanceGenerator({}).generate('bool');
      }
      /* eslint-enable no-new */

      expect(invalidMethod).to.throw(Error);
      expect(validMethod).to.not.throw(Error);
    });
  });

  describe('#generate', function () {
    it(
      'resolves to a value',
      asyncFunction(async function () {
        const chance = new ChanceGenerator({});
        const val = await chance.generate('bool', { likelihood: 30 });
        expect(val).to.exist;
      }),
    );

    it(
      'supports multiple parameters',
      asyncFunction(async function () {
        const chance = new ChanceGenerator({});
        const val = await chance.generate(
          'pickset',
          ['one', 'two', 'three'],
          2,
        );
        expect(val).to.exist;
        expect(val.length).to.equal(2);
      }),
    );
  });
});
