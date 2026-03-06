import FactoryGirl from './FactoryGirl.ts';

export { default as DefaultAdapter } from './adapters/DefaultAdapter.ts';
export type {
  Adapter,
  Attributes,
  BuildOptions,
  Definition,
  FactoryGirlOptions,
  Generator,
  Hook,
  Initializer,
  MaybeReadonlyArray,
  Options
} from './FactoryGirl.ts';
export { FactoryGirl };

const factory = new FactoryGirl();
factory.FactoryGirl = FactoryGirl;

export { factory };

export default factory;
