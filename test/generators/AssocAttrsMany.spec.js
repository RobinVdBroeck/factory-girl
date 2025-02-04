import { describe, it, expect, vi } from 'vitest';
import AssocAttrsMany from '../../src/generators/AssocAttrsMany.ts';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl.js';

describe('AssocAttrsMany', function () {
  const factoryGirl = new DummyFactoryGirl();

  describe('#generate', function () {
    it('calls attrsMany on factoryGirl', async function () {
      const spy = vi.spyOn(factoryGirl, 'attrsMany');
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      await assocAttrsMany.generate('model', 10);
      expect(spy).toHaveBeenCalledTimes(1);
      vi.restoreAllMocks();
    });

    it('passes arguments to attrsMany correctly', async function () {
      const spy = vi.spyOn(factoryGirl, 'attrsMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      await assocAttrsMany.generate('model', 10, dummyAttrs, dummyBuildOptions);
      expect(spy).toHaveBeenCalledWith(
        'model',
        10,
        dummyAttrs,
        dummyBuildOptions,
      );
      vi.restoreAllMocks();
    });

    it('returns a promise', function () {
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      const modelsP = assocAttrsMany.generate('model', 10);
      expect(modelsP.then).toBeTypeOf('function');
      return expect(modelsP).resolves.toBeDefined();
    });

    it('resolves to array returned by attrsMany', async function () {
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      const models = await assocAttrsMany.generate('model', 10);
      expect(models).toBeInstanceOf(Array);
      expect(models).toHaveLength(2);
      expect(models[0].attrs.name).toBe('Andrew');
      expect(models[1].attrs.age).toBe(25);
    });

    it('resolves to array of keys if key is set', async function () {
      const assocAttrsMany = new AssocAttrsMany(factoryGirl);
      const models = await assocAttrsMany.generate('model', 10, 'name');
      expect(models).toHaveLength(2);
      expect(models[0]).toBe('Andrew');
      expect(models[1]).toBe('Isaac');
    });
  });
});
