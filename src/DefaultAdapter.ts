import { Adapter } from './types';

export default class DefaultAdapter implements Adapter {
  private ensureMethodExists(
    model: object,
    methodName: string,
  ): asserts model is Record<typeof methodName, (...args: any[]) => any> {
    if (typeof model[methodName] !== 'function') {
      throw new Error(
        `The method "${String(methodName)}" does not exist on the model.`,
      );
    }
  }

  build<T>(Model: new (props: any) => T, props: any): T {
    return new Model(props);
  }

  save<T extends object>(model: T): Promise<T> {
    this.ensureMethodExists(model, 'save');
    return model.save();
  }

  destroy<T extends object>(model: T): Promise<T> {
    this.ensureMethodExists(model, 'destroy');
    return model.destroy();
  }

  get<T extends object>(model: T, attr: string): any {
    this.ensureMethodExists(model, 'get');
    return model.get(attr);
  }

  set<T extends object>(props: Record<string, any>, model: T): T {
    this.ensureMethodExists(model, 'set');
    model.set(props);
    return model;
  }
}
