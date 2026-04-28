import {
  buildJapaneseAdminsUrl,
  fetchPrefectureGeojson,
  fetchMunicipalityGeojson,
} from '../src/utils/japaneseAdminsUtils';

// fetchJson をモック
jest.mock('../src/utils/fetchJson', () => ({
  fetchJson: jest.fn(),
}));

import { fetchJson } from '../src/utils/fetchJson';
const mockedFetchJson = fetchJson as jest.MockedFunction<typeof fetchJson>;

describe('japaneseAdminsUtils', () => {
  beforeEach(() => {
    mockedFetchJson.mockReset();
  });

  describe('buildJapaneseAdminsUrl', () => {
    it('都道府県コード（2桁）でURLを生成する', () => {
      const url = buildJapaneseAdminsUrl('01');
      expect(url).toBe('https://geolonia.github.io/japanese-admins/01/01.json');
    });

    it('市区町村コード（5桁）でURLを生成する', () => {
      const url = buildJapaneseAdminsUrl('01101');
      expect(url).toBe('https://geolonia.github.io/japanese-admins/01/01101.json');
    });

    it('47都道府県のURLを生成する', () => {
      const url = buildJapaneseAdminsUrl('47');
      expect(url).toBe('https://geolonia.github.io/japanese-admins/47/47.json');
    });
  });

  describe('fetchPrefectureGeojson', () => {
    const mockGeojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
          properties: { name: '北海道' },
        },
      ],
    };

    it('都道府県コードを指定してGeoJSONを取得する', async () => {
      mockedFetchJson.mockResolvedValueOnce(mockGeojson);
      const result = await fetchPrefectureGeojson('01');
      expect(result).toEqual(mockGeojson);
      expect(mockedFetchJson).toHaveBeenCalledWith('https://geolonia.github.io/japanese-admins/01/01.json');
    });

    it('取得失敗時は null を返す', async () => {
      mockedFetchJson.mockResolvedValueOnce(null);
      const result = await fetchPrefectureGeojson('99');
      expect(result).toBeNull();
    });
  });

  describe('fetchMunicipalityGeojson', () => {
    const mockGeojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]] },
          properties: { name: '札幌市中央区' },
        },
      ],
    };

    it('市区町村コードを指定してGeoJSONを取得する', async () => {
      mockedFetchJson.mockResolvedValueOnce(mockGeojson);
      const result = await fetchMunicipalityGeojson('01101');
      expect(result).toEqual(mockGeojson);
      expect(mockedFetchJson).toHaveBeenCalledWith('https://geolonia.github.io/japanese-admins/01/01101.json');
    });

    it('取得失敗時は null を返す', async () => {
      mockedFetchJson.mockResolvedValueOnce(null);
      const result = await fetchMunicipalityGeojson('99999');
      expect(result).toBeNull();
    });
  });
});
