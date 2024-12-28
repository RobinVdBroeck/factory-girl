import FactoryGirl from './FactoryGirl.js';

export { default as DefaultAdapter } from './adapters/DefaultAdapter.js';

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

export { factory };

export default factory;
