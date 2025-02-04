import { describe, it, expect } from 'vitest';
import Assoc from '../../src/generators/Assoc.ts';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl.js';

describe('Assoc', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl();
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const assoc = new Assoc(factoryGirl);

    it('returns a promise', function () {
      const modelP = assoc.generate(name, key, dummyAttrs, dummyBuildOptions);
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null', async function () {
      const assocWithNullKey = new Assoc(factoryGirl);
      const model = await assocWithNullKey.generate(name);
      expect(model).to.be.an('object');
    });

    it('resolves to the object property returned by factory if key is not null', async function () {
      const assocWithKey = new Assoc(factoryGirl);
      const modelA = await assocWithKey.generate(name, 'name');
      expect(modelA).to.be.equal('Wayne');
    });
  });
});
