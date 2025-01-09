import '../test-helper/testUtils.js';
import { expect } from 'chai';
import Generator from '../../src/generators/Generator.js';
// import _debug from 'debug';

// const debug = _debug('GeneratorSpec');

describe('Generator', function () {
  describe('#constructor', function () {
    it('can be created', function () {
      const generator = new Generator({});
      expect(generator).to.be.instanceof(Generator);
    });

    it('throws an error if factoryGirl is not passed', function () {
      function noFactoryGirl() {
        new Generator();
      }

      expect(noFactoryGirl).to.throw(Error);
    });
  });

  describe('#generate', function () {
    it('throws an error', function () {
      const generator = new Generator({});

      function notImplemented() {
        generator.generate();
      }

      expect(notImplemented).to.throw(Error);
    });
  });
});
