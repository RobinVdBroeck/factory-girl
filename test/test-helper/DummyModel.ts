export default class DummyModel {
  attrs: Record<string, any>;
  constructorCalled: boolean;
  declare saveCalled: boolean;
  declare destroyCalled: boolean;

  constructor(attrs: Record<string, any> = {}) {
    this.attrs = Object.assign(
      {
        name: attrs.name || 'George',
        age: attrs.age || 27
      },
      attrs
    );
    this.constructorCalled = true;
  }
  async save() {
    this.saveCalled = true;
    return this;
  }
  async destroy() {
    this.destroyCalled = true;
    return this;
  }
  get(attr: string) {
    return this.attrs[attr];
  }
  set(attrs: Record<string, any>) {
    return Object.assign(this.attrs, attrs);
  }
}
