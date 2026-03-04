import FactoryGirl from './FactoryGirl';

export DefaultAdapter from './adapters/DefaultAdapter';

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

export { factory };

export default factory;
