import { describe, it, expect } from 'vitest';
import AssocAttrs from '../../src/generators/AssocAttrs.js';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl.js';

describe('AssocAttrs', function () {
  describe('#generate', function () {
    const factoryGirl = new DummyFactoryGirl();
    const name = 'someModel';
    const key = 'someKey';
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const assocAttrs = new AssocAttrs(factoryGirl);

    it('returns a promise', function () {
      const modelP = assocAttrs.generate(
        name,
        key,
        dummyAttrs,
        dummyBuildOptions,
      );
      expect(modelP.then).to.be.a('function');
      return expect(modelP).to.be.eventually.fulfilled;
    });

    it('resolves to the object returned by factory if key is null', async function () {
      const assocAttrsWithNullKey = new AssocAttrs(factoryGirl);
      const model = await assocAttrsWithNullKey.generate(name);
      expect(model).to.be.an('object');
    });

    it('resolves to the object property returned by factory if key is not null', async function () {
      const assocAttrsWithKey = new AssocAttrs(factoryGirl);
      const modelA = await assocAttrsWithKey.generate(name, 'name');
      expect(modelA).to.be.equal('Bill');
    });
  });
});
