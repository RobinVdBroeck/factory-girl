type PlainObject = { [key: string]: any };

export default async function asyncPopulate<
  T extends PlainObject,
  U extends PlainObject,
>(target: T, source: U): Promise<void> {
  if (typeof target !== 'object' || target === null) {
    return Promise.reject(new Error('Invalid target passed'));
  }
  if (typeof source !== 'object' || source === null) {
    return Promise.reject(new Error('Invalid source passed'));
  }

  const promises = Object.keys(source).map((attr) => {
    let promise: Promise<void> | undefined;

    if (Array.isArray(source[attr])) {
      (target as PlainObject)[attr] = [];
      promise = asyncPopulate(
        (target as PlainObject)[attr],
        source[attr] as PlainObject,
      );
    } else if (source[attr] === null || source[attr] === undefined) {
      (target as PlainObject)[attr] = source[attr];
    } else if (isPlainObject(source[attr])) {
      (target as PlainObject)[attr] = (target as PlainObject)[attr] || {};
      promise = asyncPopulate(
        (target as PlainObject)[attr],
        source[attr] as PlainObject,
      );
    } else if (typeof source[attr] === 'function') {
      promise = Promise.resolve((source[attr] as () => any)()).then((v) => {
        (target as PlainObject)[attr] = v;
      });
    } else {
      promise = Promise.resolve(source[attr]).then((v) => {
        (target as PlainObject)[attr] = v;
      });
    }

    return promise;
  });

  await Promise.all(promises);
  return undefined;
}

const objectProto = Object.getPrototypeOf({});
function isPlainObject(o: any): o is PlainObject {
  return Object.getPrototypeOf(o) === objectProto;
}
