export interface Options {
  formatOutput?: boolean;
}

export interface Arr {
  _bracketLines: [number, number];
  _itemLines: number[];
  map: (cb: (a: string, b: number) => string) => string[];
}
