export default class DefaultAdapter {
  build<M = any>(Model: any, props: Record<string, any>): M {
    return new Model(props);
  }
  async save<M = any>(model: M, Model: any): Promise<M> {
    return Promise.resolve((model as any).save()).then(() => model);
  }
  async destroy<M = any>(model: M, Model: any): Promise<M> {
    return Promise.resolve((model as any).destroy()).then(() => model);
  }
  get(model: any, attr: string, Model?: any): any {
    return model.get(attr);
  }
  set(props: Record<string, any>, model: any, Model?: any): any {
    return model.set(props);
  }
}
