import { expect, describe, it } from 'vitest';
import Factory, { DefaultAdapter } from '../src/index.js';

import FactoryGirl from '../src/FactoryGirl';
import DA from '../src/adapters/DefaultAdapter';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(DA).to.be.equal(DefaultAdapter);
  });
});
