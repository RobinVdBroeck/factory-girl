import { describe, it, expect, vi } from 'vitest';
import Sequence from '../../src/generators/Sequence.ts';

describe('Sequence', function () {
  describe('#constructor', function () {
    it('can be created', function () {
      const sequence = new Sequence({});
      expect(sequence).toBeInstanceOf(Sequence);
    });
  });

  describe('#reset', function () {
    it('reset the sequence for all if id not provided', function () {
      Sequence.sequences['some.id.1'] = 2;
      Sequence.sequences['some.id.2'] = 2;
      Sequence.reset();
      expect(Sequence.sequences['some.id.1']).toBeUndefined();
      expect(Sequence.sequences['some.id.2']).toBeUndefined();
    });

    it('reset the sequence for id', function () {
      Sequence.sequences['some.id.1'] = 2;
      Sequence.sequences['some.id.2'] = 2;
      Sequence.reset('some.id.1');
      expect(Sequence.sequences['some.id.1']).toBeUndefined();
      expect(Sequence.sequences['some.id.2']).toBe(2);
      Sequence.reset('some.id.2');
    });
  });

  describe('#generate', function () {
    it('generates an id if not provided', function () {
      const sequence = new Sequence({});
      const spy = vi.spyOn(sequence, 'generate');
      sequence.generate();
      expect(spy).toHaveBeenCalled();
      vi.restoreAllMocks();
    });
  });
});
