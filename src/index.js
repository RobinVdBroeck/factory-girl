import FactoryGirl from './FactoryGirl.js';

export { default as ObjectAdapter } from './adapters/ObjectAdapter.js';
export { default as BookshelfAdapter } from './adapters/BookshelfAdapter.js';
export { default as DefaultAdapter } from './adapters/DefaultAdapter.js';
export { default as MongooseAdapter } from './adapters/MongooseAdapter.js';
export { default as SequelizeAdapter } from './adapters/SequelizeAdapter.js';
export { default as ReduxORMAdapter } from './adapters/ReduxORMAdapter.js';

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

export { factory };

export default factory;
