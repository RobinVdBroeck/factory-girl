import './test-helper/testUtils.js';
import { expect } from 'chai';
import Factory, { DefaultAdapter } from '../src/index';

import FactoryGirl from '../src/FactoryGirl';
import DA from '../src/adapters/DefaultAdapter';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(DA).to.be.equal(DefaultAdapter);
  });
});
