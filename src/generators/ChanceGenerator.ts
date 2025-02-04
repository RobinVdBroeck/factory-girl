// Import the necessary modules
import Chance from 'chance';

// Create a new instance of Chance
const chance = new Chance();

// Utility type to extract keys of Chance that are functions
type ChanceFunctionKeys = {
  [K in keyof typeof chance]: (typeof chance)[K] extends (...args: any[]) => any
    ? K
    : never;
}[keyof typeof chance];

// Define the ChanceGenerator class
export default class ChanceGenerator {
  // Define the generate method with appropriate typing
  generate<TKey extends ChanceFunctionKeys>(
    chanceMethod: TKey,
    ...options: Parameters<(typeof chance)[TKey]>
  ): ReturnType<(typeof chance)[TKey]> | void {
    if (typeof chance[chanceMethod] == 'function') {
      throw new Error('Invalid chance method requested');
    }
    // Call the requested method with the provided options
    // Call the method with the provided options
    return (chance[chanceMethod] as (...args: any[]) => any)(...options);
  }
}
