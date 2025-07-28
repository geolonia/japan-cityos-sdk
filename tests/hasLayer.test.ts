import { hasLayer } from '../src/utils/mapUtils';

describe('hasLayer', () => {
  let map: any;

  beforeEach(() => {
    map = {
      getLayer: jest.fn()
    };
  });

  it('ベースIDが存在する場合はtrueを返す', () => {
    map.getLayer.mockImplementation((id: string) => id === 'foo' ? {} : undefined);
    expect(hasLayer(map, 'foo')).toBe(true);
  });

  it('line派生IDが存在する場合はtrueを返す', () => {
    map.getLayer.mockImplementation((id: string) => id === 'foo-line' ? {} : undefined);
    expect(hasLayer(map, 'foo')).toBe(true);
  });

  it('polygon派生IDが存在する場合はtrueを返す', () => {
    map.getLayer.mockImplementation((id: string) => id === 'foo-polygon' ? {} : undefined);
    expect(hasLayer(map, 'foo')).toBe(true);
  });

  it('どのIDも存在しない場合はfalseを返す', () => {
    map.getLayer.mockReturnValue(undefined);
    expect(hasLayer(map, 'foo')).toBe(false);
  });

  it('getLayerが例外を投げてもfalseを返す', () => {
    map.getLayer.mockImplementation(() => { throw new Error('not found'); });
    expect(hasLayer(map, 'foo')).toBe(false);
  });
});
