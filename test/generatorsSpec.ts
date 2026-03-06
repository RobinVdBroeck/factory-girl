import './test-helper/testUtils.ts';
import FactoryGirl from '../src/FactoryGirl.ts';
import { expect } from 'chai';
import DummyModel from './test-helper/DummyModel.ts';
import DummyAdapter from './test-helper/DummyAdapter.ts';
import sinon from 'sinon';

describe('assoc', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Wayne', age: 23 });
  });

  it('calls create on the factoryGirl object', async function () {
    const spy = sinon.spy(factoryGirl, 'create');
    const thunk = factoryGirl.assoc('model', 'name', {}, {});
    await thunk();
    expect(spy).to.have.been.calledWith('model', {}, {});
    spy.restore();
  });

  it('returns a function that returns a promise', function () {
    const thunk = factoryGirl.assoc('model', 'name');
    const result = thunk();
    expect(result.then).to.be.a('function');
    return expect(result).to.be.eventually.fulfilled;
  });

  it('resolves to the model if key is not set', async function () {
    const thunk = factoryGirl.assoc('model');
    const model = await thunk();
    expect(model).to.be.an('object');
    expect(model).to.be.an.instanceof(DummyModel);
  });

  it('resolves to the model property if key is set', async function () {
    const thunk = factoryGirl.assoc('model', 'name');
    const value = await thunk();
    expect(value).to.equal('Wayne');
  });
});

describe('assocAttrs', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Bill', age: 32 });
  });

  it('calls attrs on the factoryGirl object', async function () {
    const spy = sinon.spy(factoryGirl, 'attrs');
    const thunk = factoryGirl.assocAttrs('model', undefined, {}, {});
    await thunk();
    expect(spy).to.have.been.calledWith('model', {}, {});
    spy.restore();
  });

  it('returns a function that returns a promise', function () {
    const thunk = factoryGirl.assocAttrs('model');
    const result = thunk();
    expect(result.then).to.be.a('function');
    return expect(result).to.be.eventually.fulfilled;
  });

  it('resolves to the attrs if key is not set', async function () {
    const thunk = factoryGirl.assocAttrs('model');
    const model = await thunk();
    expect(model).to.be.an('object');
    expect(model.name).to.equal('Bill');
  });

  it('resolves to the attr property if key is set', async function () {
    const thunk = factoryGirl.assocAttrs('model', 'name');
    const value = await thunk();
    expect(value).to.equal('Bill');
  });
});

describe('assocMany', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Wayne', age: 23 });
  });

  it('calls createMany on factoryGirl', async function () {
    const spy = sinon.spy(factoryGirl, 'createMany');
    const thunk = factoryGirl.assocMany('model', 2);
    await thunk();
    expect(spy).to.have.been.calledOnce;
    spy.restore();
  });

  it('passes arguments to createMany correctly', async function () {
    const spy = sinon.spy(factoryGirl, 'createMany');
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const thunk = factoryGirl.assocMany('model', 2, undefined, dummyAttrs, dummyBuildOptions);
    await thunk();
    expect(spy).to.have.been.calledWith('model', 2, dummyAttrs, dummyBuildOptions);
    spy.restore();
  });

  it('returns a function that returns a promise', function () {
    const thunk = factoryGirl.assocMany('model', 2);
    const result = thunk();
    expect(result.then).to.be.a('function');
    return expect(result).to.be.eventually.fulfilled;
  });

  it('resolves to array returned by createMany', async function () {
    const thunk = factoryGirl.assocMany('model', 2);
    const models = await thunk();
    expect(models).to.be.an('array');
    expect(models).to.have.lengthOf(2);
  });

  it('resolves to array of keys if key is set', async function () {
    const thunk = factoryGirl.assocMany('model', 2, 'name');
    const values = await thunk();
    expect(values).to.have.lengthOf(2);
    expect(values[0]).to.equal('Wayne');
    expect(values[1]).to.equal('Wayne');
  });
});

describe('assocAttrsMany', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Andrew', age: 21 });
  });

  it('calls attrsMany on factoryGirl', async function () {
    const spy = sinon.spy(factoryGirl, 'attrsMany');
    const thunk = factoryGirl.assocAttrsMany('model', 2);
    await thunk();
    expect(spy).to.have.been.calledOnce;
    spy.restore();
  });

  it('passes arguments to attrsMany correctly', async function () {
    const spy = sinon.spy(factoryGirl, 'attrsMany');
    const dummyAttrs = {};
    const dummyBuildOptions = {};
    const thunk = factoryGirl.assocAttrsMany('model', 2, undefined, dummyAttrs, dummyBuildOptions);
    await thunk();
    expect(spy).to.have.been.calledWith('model', 2, dummyAttrs, dummyBuildOptions);
    spy.restore();
  });

  it('returns a function that returns a promise', function () {
    const thunk = factoryGirl.assocAttrsMany('model', 2);
    const result = thunk();
    expect(result.then).to.be.a('function');
    return expect(result).to.be.eventually.fulfilled;
  });

  it('resolves to array returned by attrsMany', async function () {
    const thunk = factoryGirl.assocAttrsMany('model', 2);
    const models = await thunk();
    expect(models).to.be.an('array');
    expect(models).to.have.lengthOf(2);
  });

  it('resolves to array of keys if key is set', async function () {
    const thunk = factoryGirl.assocAttrsMany('model', 2, 'name');
    const values = await thunk();
    expect(values).to.have.lengthOf(2);
    expect(values[0]).to.be.equal('Andrew');
    expect(values[1]).to.be.equal('Andrew');
  });
});

describe('assocAttrsMany validation', function () {
  it('rejects if num is not a valid number', async function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Test' });
    const thunk = factoryGirl.assocAttrsMany('model', 0);
    return expect(thunk()).to.be.eventually.rejectedWith('Invalid number of items requested');
  });

  it('rejects if num is negative', async function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Test' });
    const thunk = factoryGirl.assocAttrsMany('model', -1);
    return expect(thunk()).to.be.eventually.rejectedWith('Invalid number of items requested');
  });
});

describe('assocMany with attrs and buildOptions', function () {
  it('passes attrs and buildOptions to createMany', async function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Default', age: 1 });
    const spy = sinon.spy(factoryGirl, 'createMany');
    const dummyAttrs = { name: 'Custom' };
    const dummyBuildOptions = { opt: true };
    const thunk = factoryGirl.assocMany('model', 2, undefined, dummyAttrs, dummyBuildOptions);
    await thunk();
    expect(spy).to.have.been.calledWith('model', 2, dummyAttrs, dummyBuildOptions);
    spy.restore();
  });
});

describe('assocAttrsMany with attrs and buildOptions', function () {
  it('passes attrs and buildOptions to attrsMany', async function () {
    const factoryGirl = new FactoryGirl();
    factoryGirl.define('model', DummyModel, { name: 'Default', age: 1 });
    const spy = sinon.spy(factoryGirl, 'attrsMany');
    const dummyAttrs = { name: 'Custom' };
    const dummyBuildOptions = { opt: true };
    const thunk = factoryGirl.assocAttrsMany('model', 2, undefined, dummyAttrs, dummyBuildOptions);
    await thunk();
    expect(spy).to.have.been.calledWith('model', 2, dummyAttrs, dummyBuildOptions);
    spy.restore();
  });
});

describe('sequence', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
  });

  describe('#reset', function () {
    it('resets all sequences if id not provided', function () {
      const seq1 = factoryGirl.seq('reset.test.1');
      const seq2 = factoryGirl.seq('reset.test.2');
      seq1();
      seq2();
      factoryGirl.resetSeq();
      // After reset, new sequences with same names start at 1
      const seq1b = factoryGirl.seq('reset.test.1');
      const seq2b = factoryGirl.seq('reset.test.2');
      expect(seq1b()).to.equal(1);
      expect(seq2b()).to.equal(1);
    });

    it('resets only the given sequence id', function () {
      const seq1 = factoryGirl.seq('reset.one');
      const seq2 = factoryGirl.seq('reset.two');
      seq1();
      seq2();
      factoryGirl.resetSeq('reset.one');
      const seq1b = factoryGirl.seq('reset.one');
      expect(seq1b()).to.equal(1);
      // seq2 should still be at 2
      expect(seq2()).to.equal(2);
    });
  });

  describe('#generate', function () {
    it('generates an auto id if not provided', function () {
      const seqFn = factoryGirl.seq();
      const val = seqFn();
      expect(val).to.equal(1);
    });

    it('initialises the sequence for id', function () {
      const seqFn = factoryGirl.seq('init.test');
      expect(seqFn()).to.equal(1);
    });

    it('does not reset the sequence for id', function () {
      const seq1 = factoryGirl.seq('noreset.test');
      seq1();
      const seq2 = factoryGirl.seq('noreset.test');
      expect(seq2()).to.equal(2);
    });

    it('generates numbers sequentially', function () {
      const seqFn = factoryGirl.seq('sequential.test');
      const seq1 = seqFn();
      const seq2 = seqFn();
      const seq3 = seqFn();
      expect(seq2 - seq1).to.be.equal(1);
      expect(seq3 - seq2).to.be.equal(1);
    });

    it('generates numbers sequentially and calls callback', function () {
      const callback = sinon.spy(function (n: number) {
        return `value${n}`;
      });
      const seqFn = factoryGirl.seq('callback.test', callback);
      const seq1 = seqFn();
      const seq2 = seqFn();
      expect(seq1).to.be.equal('value1');
      expect(seq2).to.be.equal('value2');
      expect(callback).to.be.calledTwice;
    });

    it('accepts callback as first argument', function () {
      const seqFn = factoryGirl.seq((n: number) => `item-${n}`);
      expect(seqFn()).to.equal('item-1');
      expect(seqFn()).to.equal('item-2');
    });

    it('auto-generates unique ids for multiple unnamed sequences', function () {
      const seq1 = factoryGirl.seq();
      const seq2 = factoryGirl.seq();
      // Each should maintain independent counters
      expect(seq1()).to.equal(1);
      expect(seq2()).to.equal(1);
      expect(seq1()).to.equal(2);
      expect(seq2()).to.equal(2);
    });

    it('preserves sequence state across calls with same name', function () {
      const seq1 = factoryGirl.seq('shared.name');
      expect(seq1()).to.equal(1);
      const seq2 = factoryGirl.seq('shared.name');
      expect(seq2()).to.equal(2);
    });
  });
});

describe('oneOf validation', function () {
  it('rejects non-array values', function () {
    const factoryGirl = new FactoryGirl();
    return expect(factoryGirl.oneOf('not-an-array' as any)()).to.be.eventually.rejectedWith(
      'Expected an array'
    );
  });
});

describe('chance', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
  });

  it('validates the passed chance method', function () {
    function invalidMethod() {
      factoryGirl.chance('invalidMethodName')();
    }

    function validMethod() {
      factoryGirl.chance('bool')();
    }

    expect(invalidMethod).to.throw(Error);
    expect(validMethod).to.not.throw(Error);
  });

  it('resolves to a value', function () {
    const val = factoryGirl.chance('bool', { likelihood: 30 })();
    expect(val).to.exist;
  });

  it('supports multiple parameters', function () {
    const val = factoryGirl.chance('pickset', ['one', 'two', 'three'], 2)();
    expect(val).to.exist;
    expect(val.length).to.equal(2);
  });
});

describe('oneOf', function () {
  let factoryGirl: FactoryGirl;
  beforeEach(function () {
    factoryGirl = new FactoryGirl();
  });

  it('validates possible values', function () {
    const invalidValuesP = factoryGirl.oneOf(23 as any)();
    const emptyValuesP = factoryGirl.oneOf([])();
    const validValuesP = factoryGirl.oneOf([1, 2, 3])();

    return Promise.all([
      expect(invalidValuesP).to.be.eventually.rejected,
      expect(emptyValuesP).to.be.eventually.rejected,
      expect(validValuesP).to.be.eventually.fulfilled
    ]);
  });

  it('returns a function that returns a promise', function () {
    const possibleValues = [1, 'two', 'III'];
    const thunk = factoryGirl.oneOf(possibleValues);
    const valP = thunk();
    expect(valP.then).to.be.a('function');
    return expect(valP).to.be.eventually.fulfilled;
  });

  it('always generates one of the passed values', async function () {
    const possibleValues = [1, 'two', 'III'];
    for (let i = 0; i < 5; i++) {
      const aValue = await factoryGirl.oneOf(possibleValues)();
      expect(possibleValues.indexOf(aValue) > -1).to.be.true;
    }
  });

  it('can accept functions as values', async function () {
    const val = await factoryGirl.oneOf([() => 23])();
    expect(val).to.be.equal(23);
  });

  it('can accept async functions as values', async function () {
    const val = await factoryGirl.oneOf([async () => 23])();
    expect(val).to.be.equal(23);
  });

  it('can accept functions returning promises as values', async function () {
    const val = await factoryGirl.oneOf([() => Promise.resolve(23)])();
    expect(val).to.be.equal(23);
  });

  it('can accept promises as values', async function () {
    const val = await factoryGirl.oneOf([Promise.resolve(23)])();
    expect(val).to.be.equal(23);
  });
});
