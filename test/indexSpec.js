import './test-helper/testUtils.js';
import { expect } from 'chai';
import Factory, { DefaultAdapter } from '../src/index.js';

import FactoryGirl from '../src/FactoryGirl.js';
import DA from '../src/adapters/DefaultAdapter.js';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(DA).to.be.equal(DefaultAdapter);
  });
});
