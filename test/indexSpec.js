import './test-helper/testUtils.js';
import { expect } from 'chai';
import Factory, {
  BookshelfAdapter,
  SequelizeAdapter,
  DefaultAdapter,
  MongooseAdapter,
  ObjectAdapter,
} from '../src/index.js';

import FactoryGirl from '../src/FactoryGirl.js';
import BA from '../src/adapters/BookshelfAdapter.js';
import SA from '../src/adapters/SequelizeAdapter.js';
import DA from '../src/adapters/DefaultAdapter.js';
import MA from '../src/adapters/MongooseAdapter.js';
import OA from '../src/adapters/ObjectAdapter.js';

describe('index', function () {
  it('exports correctly', function () {
    expect(Factory).to.be.instanceof(FactoryGirl);

    expect(BA).to.be.equal(BookshelfAdapter);
    expect(SA).to.be.equal(SequelizeAdapter);
    expect(DA).to.be.equal(DefaultAdapter);
    expect(MA).to.be.equal(MongooseAdapter);
    expect(OA).to.be.equal(ObjectAdapter);
  });
});
