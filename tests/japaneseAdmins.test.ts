import {
  buildJapaneseAdminsUrl,
  fetchAdminBoundary,
  isMunicipalityCode
} from '../src/utils/japaneseAdmins';

describe('buildJapaneseAdminsUrl', () => {
  it('市区町村コード（5桁）からURLを生成できる', () => {
    const url = buildJapaneseAdminsUrl('01101');
    expect(url).toBe('https://geolonia.github.io/japanese-admins/01/01101.json');
  });

  it('東京都千代田区のURLを生成できる', () => {
    const url = buildJapaneseAdminsUrl('13101');
    expect(url).toBe('https://geolonia.github.io/japanese-admins/13/13101.json');
  });

  it('無効なコードの場合はnullを返す', () => {
    const url = buildJapaneseAdminsUrl('invalid');
    expect(url).toBeNull();
  });

  it('空文字の場合はnullを返す', () => {
    const url = buildJapaneseAdminsUrl('');
    expect(url).toBeNull();
  });

  it('4桁のコードの場合はnullを返す', () => {
    const url = buildJapaneseAdminsUrl('0110');
    expect(url).toBeNull();
  });

  it('都道府県コード範囲外（00）の場合はnullを返す', () => {
    const url = buildJapaneseAdminsUrl('00101');
    expect(url).toBeNull();
  });

  it('都道府県コード範囲外（48）の場合はnullを返す', () => {
    const url = buildJapaneseAdminsUrl('48101');
    expect(url).toBeNull();
  });
});

describe('isMunicipalityCode', () => {
  it('有効な5桁の市区町村コードはtrueを返す', () => {
    expect(isMunicipalityCode('01101')).toBe(true);
    expect(isMunicipalityCode('13101')).toBe(true);
  });

  it('5桁でない場合はfalseを返す', () => {
    expect(isMunicipalityCode('0110')).toBe(false);
    expect(isMunicipalityCode('011011')).toBe(false);
  });

  it('数字以外を含む場合はfalseを返す', () => {
    expect(isMunicipalityCode('0110a')).toBe(false);
  });

  it('都道府県コード部分が00の場合はfalseを返す', () => {
    expect(isMunicipalityCode('00101')).toBe(false);
  });

  it('都道府県コード部分が48以上の場合はfalseを返す', () => {
    expect(isMunicipalityCode('48101')).toBe(false);
    expect(isMunicipalityCode('99999')).toBe(false);
  });
});

describe('fetchAdminBoundary', () => {
  it('有効な市区町村コード（札幌市中央区）でGeoJSONを取得できる', async () => {
    const geojson = await fetchAdminBoundary('01101');
    expect(geojson).not.toBeNull();
    if (geojson) {
      expect(geojson.type).toBe('FeatureCollection');
      expect(Array.isArray(geojson.features)).toBe(true);
      expect(geojson.features.length).toBeGreaterThan(0);
    }
  }, 10000);

  it('無効なコードの場合はnullを返す', async () => {
    const geojson = await fetchAdminBoundary('invalid');
    expect(geojson).toBeNull();
  });

  it('存在しない市区町村コードの場合はnullを返す', async () => {
    const geojson = await fetchAdminBoundary('01999');
    expect(geojson).toBeNull();
  }, 10000);

  it('都道府県コード範囲外の場合はnullを返す', async () => {
    const geojson = await fetchAdminBoundary('99999');
    expect(geojson).toBeNull();
  });
});
