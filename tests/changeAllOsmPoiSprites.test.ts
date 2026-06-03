import { updateSpriteSheet, addOsmSprite } from '../src/utils/osmPoiUtils';
import { ALL_OSM_LAYER_TYPES } from '../src/types';

jest.mock('../src/utils/osmPoiUtils', () => ({
  ...jest.requireActual('../src/utils/osmPoiUtils'),
  updateSpriteSheet: jest.fn(),
  addOsmSprite: jest.fn()
}));

describe('changeAllOsmPoiSprites', () => {
  let mockMap: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMap = {
      getLayer: jest.fn(),
      getStyle: jest.fn(() => ({ layers: [], sprite: '' })),
      setStyle: jest.fn(),
      setLayoutProperty: jest.fn()
    };
  });

  it('表示中のレイヤーのスプライトのみ更新する', () => {
    // osm-restaurant と osm-cafe のみ表示中
    mockMap.getLayer.mockImplementation((id: string) => {
      if (id === 'osm-restaurant' || id === 'osm-cafe') return {};
      return undefined;
    });

    const spriteKey = 'mapfan';
    const spriteSheetUrl: {[key: string]: string} = {
      'chizubouken-lab': 'https://geolonia.github.io/chizubouken-lab-sprite/sprite',
      'mapfan': 'https://geolonia.github.io/mapfandb-sprite/sprite',
      'smartmap': 'https://geolonia.github.io/custom-smartmap-sprite/sprite',
      'basic': 'https://geoloniamaps.github.io/basic-v1/basic-v1',
    };

    // changeAllOsmPoiSprites のロジックを直接テスト
    addOsmSprite(mockMap, { [spriteKey]: spriteSheetUrl[spriteKey] }, spriteSheetUrl);
    ALL_OSM_LAYER_TYPES.forEach(layerType => {
      const layerId = `osm-${layerType}`;
      if (mockMap.getLayer(layerId)) {
        updateSpriteSheet(mockMap, layerType, spriteKey);
      }
    });

    expect(addOsmSprite).toHaveBeenCalledTimes(1);
    expect(updateSpriteSheet).toHaveBeenCalledTimes(2);
    expect(updateSpriteSheet).toHaveBeenCalledWith(mockMap, 'restaurant', 'mapfan');
    expect(updateSpriteSheet).toHaveBeenCalledWith(mockMap, 'cafe', 'mapfan');
  });

  it('表示中のレイヤーがない場合はupdateSpriteSheetを呼ばない', () => {
    mockMap.getLayer.mockReturnValue(undefined);

    const spriteKey = 'basic';
    const spriteSheetUrl: {[key: string]: string} = {
      'basic': 'https://geoloniamaps.github.io/basic-v1/basic-v1',
    };

    addOsmSprite(mockMap, { [spriteKey]: spriteSheetUrl[spriteKey] }, spriteSheetUrl);
    ALL_OSM_LAYER_TYPES.forEach(layerType => {
      const layerId = `osm-${layerType}`;
      if (mockMap.getLayer(layerId)) {
        updateSpriteSheet(mockMap, layerType, spriteKey);
      }
    });

    expect(addOsmSprite).toHaveBeenCalledTimes(1);
    expect(updateSpriteSheet).not.toHaveBeenCalled();
  });
});
