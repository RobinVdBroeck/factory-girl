export default class DefaultAdapter {
  build(Model: any, props: Record<string, any>): any {
    return new Model(props);
  }
  async save(model: any, Model: any): Promise<any> {
    return Promise.resolve(model.save()).then(() => model);
  }
  async destroy(model: any, Model: any): Promise<any> {
    return Promise.resolve(model.destroy()).then(() => model);
  }
  get(model: any, attr: string, Model?: any): any {
    return model.get(attr);
  }
  set(props: Record<string, any>, model: any, Model?: any): any {
    return model.set(props);
  }
}
