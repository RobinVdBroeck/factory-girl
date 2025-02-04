export interface Generator<TArgs extends unknown[], TResult> {
  generate: (...args: TArgs) => TResult;
}

export type Definition<T> = T | Generator<[], T> | Promise<T>;

export type Attributes<T> = {
  [P in keyof T]: Definition<T[P]>;
};

export type BuildOptions = Record<string, any>;

export type Initializer<T, BO = BuildOptions> =
  | Attributes<T>
  | ((buildOptions?: BO) => Attributes<T>)
  | ((buildOptions?: BO) => Promise<Attributes<T>>);

export interface Options<T> {
  afterBuild?: Hook<T> | undefined;
  afterCreate?: Hook<T> | undefined;
}

export type Hook<T> = (model: any, attrs: T | T[], options: any) => any;

export interface Adapter {
  /**
   * Builds a new instance of the model with given properties.
   */
  build<T extends object>(Model: new (props: any) => T, props: any): T;

  /**
   * Saves the given model instance.
   */
  save<T extends object>(model: T): Promise<T>;

  /**
   * Destroys the given model instance.
   */
  destroy<T extends object>(model: T): Promise<T>;

  /**
   * Retrieves an attribute value from the model.
   */
  get<T extends object>(model: T, attr: string): any;

  /**
   * Sets attributes on the model instance.
   */
  set<T extends object>(props: Record<string, any>, model: T): T;
}
