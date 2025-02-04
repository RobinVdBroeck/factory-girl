import { describe, it, expect, vi } from 'vitest';
import AssocMany from '../../src/generators/AssocMany.ts';
import DummyFactoryGirl from '../test-helper/DummyFactoryGirl.js';

describe('AssocMany', function () {
  const factoryGirl = new DummyFactoryGirl();

  describe('#generate', function () {
    it('calls createMany on factoryGirl', async function () {
      const spy = vi.spyOn(factoryGirl, 'createMany');
      const assocMany = new AssocMany(factoryGirl);
      await assocMany.generate('model', 10);
      expect(spy).toHaveBeenCalledTimes(1);
      vi.restoreAllMocks();
    });

    it('passes arguments to createMany correctly', async function () {
      const spy = vi.spyOn(factoryGirl, 'createMany');
      const dummyAttrs = {};
      const dummyBuildOptions = {};
      const assocMany = new AssocMany(factoryGirl);
      await assocMany.generate('model', 10, dummyAttrs, dummyBuildOptions);
      expect(spy).toHaveBeenCalledWith(
        'model',
        10,
        dummyAttrs,
        dummyBuildOptions,
      );
      vi.restoreAllMocks();
    });

    it('returns a promise', function () {
      const assocMany = new AssocMany(factoryGirl);
      const modelsP = assocMany.generate('model', 10);
      expect(modelsP.then).toBeTypeOf('function');
      return expect(modelsP).resolves.toBeDefined();
    });

    it('resolves to array returned by createMany', async function () {
      const assocMany = new AssocMany(factoryGirl);
      const models = await assocMany.generate('model', 10);
      expect(models).toBeInstanceOf(Array);
      expect(models).toHaveLength(2);
      expect(models[0].attrs.name).toBe('Wayne');
      expect(models[1].attrs.age).toBe(21);
    });

    it('resolves to array of keys if key is set', async function () {
      const assocMany = new AssocMany(factoryGirl);
      const models = await assocMany.generate('model', 10, 'name');
      expect(models).toHaveLength(2);
      expect(models[0]).toBe('Wayne');
      expect(models[1]).toBe('Jane');
    });
  });
});
