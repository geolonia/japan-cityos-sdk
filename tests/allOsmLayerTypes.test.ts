import { ALL_OSM_LAYER_TYPES } from '../src/types';

describe('ALL_OSM_LAYER_TYPES', () => {
  it('16種類の全レイヤータイプを含む', () => {
    expect(ALL_OSM_LAYER_TYPES).toHaveLength(16);
  });

  it('各レイヤータイプが含まれている', () => {
    const expected = [
      'restaurant', 'railway', 'mountain', 'airport', 'school',
      'college', 'convenience', 'bank', 'hospital', 'cafe',
      'fast-food', 'zoo', 'parking', 'castle', 'museum', 'park'
    ];
    expected.forEach(type => {
      expect(ALL_OSM_LAYER_TYPES).toContain(type);
    });
  });
});
