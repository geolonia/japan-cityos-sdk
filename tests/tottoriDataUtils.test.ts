import { addTottoriDataSource, addTottoriDataLayer, removeTottoriDataLayer, fetchTottoriDataIndex, getTileType, fetchTottoriStyleSourceConfig, _resetCache } from '../src/utils/tottoriDataUtils';

// fetchJson をモック
jest.mock('../src/utils/fetchJson', () => ({
  fetchJson: jest.fn(),
}));

import { fetchJson } from '../src/utils/fetchJson';
const mockedFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

const MOCK_INDEX = [
  {
    id: 'aerial_photo_ketaka_h31',
    tileUrl: 'https://tottori.smartcity.geolonia.com/data/aerial_photo_ketaka_h31/latest/tiles/{z}/{x}/{y}.png',
    styleUrl: 'https://tottori.smartcity.geolonia.com/data/aerial_photo_ketaka_h31/latest/style.json',
    description: '鳥取県航空写真気高町（H31）',
  },
  {
    id: 'crime_tottori',
    tileUrl: 'https://tottori.smartcity.geolonia.com/data/crime_tottori/latest/tiles/{z}/{x}/{y}.pbf',
    styleUrl: 'https://tottori.smartcity.geolonia.com/data/crime_tottori/latest/style.json',
    geojsonUrl: 'https://tottori.smartcity.geolonia.com/data/crime_tottori/latest/data.geojson',
    description: '犯罪発生件数（鳥取市）',
  },
];

describe('tottoriDataUtils', () => {
  let map: any;

  beforeEach(() => {
    _resetCache();
    mockedFetchJson.mockReset();
    map = {
      sources: {} as any,
      layers: {} as any,
      addSource: jest.fn((id: string, src: any) => { map.sources[id] = src; }),
      getSource: jest.fn((id: string) => map.sources[id]),
      removeSource: jest.fn((id: string) => { delete map.sources[id]; }),
      addLayer: jest.fn((layer: any) => { map.layers[layer.id] = layer; }),
      getLayer: jest.fn((id: string) => map.layers[id]),
      removeLayer: jest.fn((id: string) => { delete map.layers[id]; }),
    };
  });

  describe('fetchTottoriDataIndex', () => {
    it('index.json を取得して返す', async () => {
      mockedFetchJson.mockResolvedValueOnce(MOCK_INDEX);
      const result = await fetchTottoriDataIndex();
      expect(result).toEqual(MOCK_INDEX);
      expect(mockedFetchJson).toHaveBeenCalledWith('https://tottori.smartcity.geolonia.com/data/index.json');
    });

    it('2回目以降はキャッシュを返す', async () => {
      mockedFetchJson.mockResolvedValueOnce(MOCK_INDEX);
      await fetchTottoriDataIndex();
      const result = await fetchTottoriDataIndex();
      expect(result).toEqual(MOCK_INDEX);
      expect(mockedFetchJson).toHaveBeenCalledTimes(1);
    });

    it('fetch 失敗時は空配列を返す', async () => {
      mockedFetchJson.mockResolvedValueOnce(null);
      const result = await fetchTottoriDataIndex();
      expect(result).toEqual([]);
    });
  });

  describe('getTileType', () => {
    it('.png はラスターと判定する', () => {
      expect(getTileType('https://example.com/tiles/{z}/{x}/{y}.png')).toBe('raster');
    });

    it('.pbf はベクターと判定する', () => {
      expect(getTileType('https://example.com/tiles/{z}/{x}/{y}.pbf')).toBe('vector');
    });

    it('クエリ付き .pbf URL をベクターと判定する', () => {
      expect(getTileType('https://example.com/tiles/{z}/{x}/{y}.pbf?token=abc')).toBe('vector');
    });

    it('ハッシュ付き .pbf URL をベクターと判定する', () => {
      expect(getTileType('https://example.com/tiles/{z}/{x}/{y}.pbf#section')).toBe('vector');
    });

    it('大文字 .PBF をベクターと判定する', () => {
      expect(getTileType('https://example.com/tiles/{z}/{x}/{y}.PBF')).toBe('vector');
    });
  });

  describe('fetchTottoriStyleSourceConfig', () => {
    it('style.json から tileUrl に一致する source の minzoom, maxzoom, bounds を取得する', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'geolonia-smartcity/test': {
            type: 'raster',
            tiles: ['https://example.com/{z}/{x}/{y}.png'],
            minzoom: 9,
            maxzoom: 19,
            bounds: [133.0, 35.0, 134.5, 35.6],
          }
        },
        layers: []
      });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({ minzoom: 9, maxzoom: 19, bounds: [133.0, 35.0, 134.5, 35.6] });
    });

    it('複数 sources がある場合、tileUrl に一致する source を選ぶ', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'unrelated-source': {
            type: 'raster',
            tiles: ['https://other.com/{z}/{x}/{y}.png'],
            minzoom: 1,
            maxzoom: 5,
          },
          'target-source': {
            type: 'raster',
            tiles: ['https://example.com/{z}/{x}/{y}.png'],
            minzoom: 9,
            maxzoom: 19,
            bounds: [133.0, 35.0, 134.5, 35.6],
          }
        },
        layers: []
      });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({ minzoom: 9, maxzoom: 19, bounds: [133.0, 35.0, 134.5, 35.6] });
    });

    it('tileUrl に一致する source がない場合は空オブジェクトを返す', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'unrelated-source': {
            type: 'raster',
            tiles: ['https://other.com/{z}/{x}/{y}.png'],
            minzoom: 1,
            maxzoom: 5,
          }
        },
        layers: []
      });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({});
    });

    it('bounds が不正な場合は bounds を含めない', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'test': {
            type: 'raster',
            tiles: ['https://example.com/{z}/{x}/{y}.png'],
            minzoom: 9,
            bounds: [133.0, 'invalid', 134.5, 35.6],
          }
        },
        layers: []
      });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({ minzoom: 9 });
    });

    it('bounds の要素数が 4 でない場合は bounds を含めない', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'test': {
            type: 'raster',
            tiles: ['https://example.com/{z}/{x}/{y}.png'],
            bounds: [133.0, 35.0],
          }
        },
        layers: []
      });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({});
    });

    it('sources がない場合は空オブジェクトを返す', async () => {
      mockedFetchJson.mockResolvedValueOnce({ version: 8 });
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({});
    });

    it('fetch 失敗時は空オブジェクトを返す', async () => {
      mockedFetchJson.mockRejectedValueOnce(new Error('Network error'));
      const config = await fetchTottoriStyleSourceConfig('https://example.com/style.json', 'https://example.com/{z}/{x}/{y}.png');
      expect(config).toEqual({});
    });
  });

  describe('addTottoriDataSource', () => {
    it('ラスタータイルのソースに minzoom/maxzoom を適用する', async () => {
      mockedFetchJson.mockResolvedValueOnce({
        version: 8,
        sources: {
          'geolonia-smartcity/aerial_photo_ketaka_h31': {
            type: 'raster',
            tiles: [MOCK_INDEX[0].tileUrl],
            tileSize: 256,
            minzoom: 9,
            maxzoom: 19,
          }
        },
        layers: []
      });
      const entry = MOCK_INDEX[0];
      const sourceId = await addTottoriDataSource(map, entry);
      expect(sourceId).toBe('tottori-aerial_photo_ketaka_h31');
      expect(map.addSource).toHaveBeenCalledWith('tottori-aerial_photo_ketaka_h31', expect.objectContaining({
        type: 'raster',
        tiles: [entry.tileUrl],
        tileSize: 256,
        minzoom: 9,
        maxzoom: 19,
      }));
    });

    it('style.json 取得失敗時は minzoom/maxzoom なしでソースを追加する', async () => {
      mockedFetchJson.mockRejectedValueOnce(new Error('Network error'));
      const entry = MOCK_INDEX[0];
      const sourceId = await addTottoriDataSource(map, entry);
      expect(sourceId).toBe('tottori-aerial_photo_ketaka_h31');
      const callArgs = map.addSource.mock.calls[0][1];
      expect(callArgs.minzoom).toBeUndefined();
      expect(callArgs.maxzoom).toBeUndefined();
    });

    it('既存ソースがあれば追加せず id を返す', async () => {
      const entry = MOCK_INDEX[0];
      map.sources['tottori-aerial_photo_ketaka_h31'] = { type: 'raster' };
      const sourceId = await addTottoriDataSource(map, entry);
      expect(sourceId).toBe('tottori-aerial_photo_ketaka_h31');
      expect(map.addSource).not.toHaveBeenCalled();
    });
  });

  describe('addTottoriDataLayer', () => {
    it('ラスタータイルのレイヤーを追加する', () => {
      const entry = MOCK_INDEX[0];
      addTottoriDataLayer(map, entry);
      expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({
        id: 'tottori-aerial_photo_ketaka_h31',
        type: 'raster',
        source: 'tottori-aerial_photo_ketaka_h31',
      }));
    });

    it('ベクタータイルのレイヤーを circle として追加する', () => {
      const entry = MOCK_INDEX[1];
      addTottoriDataLayer(map, entry);
      expect(map.addLayer).toHaveBeenCalledWith(expect.objectContaining({
        id: 'tottori-crime_tottori',
        type: 'circle',
        source: 'tottori-crime_tottori',
        'source-layer': 'data',
      }));
    });

    it('既存レイヤーがあれば追加しない', () => {
      const entry = MOCK_INDEX[0];
      map.layers['tottori-aerial_photo_ketaka_h31'] = { id: 'tottori-aerial_photo_ketaka_h31' };
      addTottoriDataLayer(map, entry);
      expect(map.addLayer).not.toHaveBeenCalled();
    });
  });

  describe('removeTottoriDataLayer', () => {
    it('レイヤーとソースを削除する', () => {
      const entry = MOCK_INDEX[0];
      map.layers['tottori-aerial_photo_ketaka_h31'] = { id: 'tottori-aerial_photo_ketaka_h31' };
      map.sources['tottori-aerial_photo_ketaka_h31'] = { type: 'raster' };
      const removedId = removeTottoriDataLayer(map, entry);
      expect(map.removeLayer).toHaveBeenCalledWith('tottori-aerial_photo_ketaka_h31');
      expect(map.removeSource).toHaveBeenCalledWith('tottori-aerial_photo_ketaka_h31');
      expect(removedId).toBe('tottori-aerial_photo_ketaka_h31');
    });

    it('レイヤーがなくソースだけの場合はソースのみ削除する', () => {
      const entry = MOCK_INDEX[0];
      map.sources['tottori-aerial_photo_ketaka_h31'] = { type: 'raster' };
      const removedId = removeTottoriDataLayer(map, entry);
      expect(map.removeLayer).not.toHaveBeenCalled();
      expect(map.removeSource).toHaveBeenCalledWith('tottori-aerial_photo_ketaka_h31');
      expect(removedId).toBe('tottori-aerial_photo_ketaka_h31');
    });

    it('レイヤーもソースもなければ何もしない', () => {
      const entry = MOCK_INDEX[0];
      const removedId = removeTottoriDataLayer(map, entry);
      expect(map.removeLayer).not.toHaveBeenCalled();
      expect(map.removeSource).not.toHaveBeenCalled();
      expect(removedId).toBeUndefined();
    });
  });
});
