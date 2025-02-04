export default class OneOf {
  generate<T extends unknown>(possibleValues: T[]): T {
    if (!Array.isArray(possibleValues)) {
      throw new Error('Expected an array of possible values');
    }

    if (possibleValues.length < 1) {
      throw new Error('Empty array passed for possible values');
    }

    const size = possibleValues.length;
    const randomIndex = Math.floor(Math.random() * size);
    const value = possibleValues[randomIndex];
    return typeof value === 'function' ? value() : value;
  }
}
