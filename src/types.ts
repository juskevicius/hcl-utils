export interface Options {
  formatOutput?: boolean;
}

export interface Arr {
  _formatting: {
    bracketLines: [number, number];
    itemLines: number[] | number[][];
  }
  map: (cb: (a: string, b: number) => string) => string[];
}
