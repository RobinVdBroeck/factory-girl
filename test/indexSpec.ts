import './test-helper/testUtils.ts';
import { expect } from 'chai';
import Factory, { DefaultAdapter } from '../src/index.ts';

import FactoryGirl from '../src/FactoryGirl.ts';
import DA from '../src/adapters/DefaultAdapter.ts';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(DA).to.be.equal(DefaultAdapter);
  });
});
