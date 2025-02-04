import FactoryGirl from '../FactoryGirl.js';

export default class Sequence {
  static sequences: Record<string, number | undefined> = {};

  public constructor(
    private _factoryGirl: FactoryGirl,
    private id?: string,
  ) {}

  static reset(id: string | null = null): void {
    if (!id) {
      Sequence.sequences = {};
    } else {
      Sequence.sequences[id] = undefined;
    }
  }

  // Method to generate a sequence number
  generate(
    id: string | null = null,
    callback?: (next: number) => any,
  ): number | any {
    if (typeof id === 'function') {
      callback = id;
      id = null;
    }
    id = id || this.id || (this.id = generateId());
    Sequence.sequences[id] = Sequence.sequences[id] || 1;
    const next = Sequence.sequences[id]!;
    Sequence.sequences[id] = next + 1;
    return callback ? callback(next) : next;
  }
}

// Helper function to generate a unique ID
function generateId(): string {
  let id: string;
  let i = 0;
  do {
    id = `_${i++}`;
  } while (id in Sequence.sequences);
  return id;
}
