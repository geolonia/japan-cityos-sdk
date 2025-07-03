import { QueryBoxTarget, toQueryBox } from '../src/toQueryBox';

describe('toQueryBox', () => {
  it('[x, y]を受け取れる', () => {
    expect(toQueryBox([1, 2] as QueryBoxTarget)).toEqual([
      [0, 1],
      [2, 3]
    ]);
  });

  it('bboxを受け取れる', () => {
    expect(toQueryBox([[1, 2], [3, 4]] as QueryBoxTarget)).toEqual([
      [1, 2],
      [3, 4]
    ]);
  });

  it('不正な値はnull', () => {
    expect(toQueryBox(undefined)).toBeNull();
    expect(toQueryBox([NaN, 2] as QueryBoxTarget)).toBeNull();
    expect(toQueryBox([1, NaN] as QueryBoxTarget)).toBeNull();
    expect(toQueryBox([1] as any)).toBeNull();
    expect(toQueryBox([] as any)).toBeNull();
    expect(toQueryBox({} as any)).toBeNull();
  });
});
