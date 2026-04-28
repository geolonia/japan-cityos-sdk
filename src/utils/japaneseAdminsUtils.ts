import { fetchJson } from './fetchJson';

const JAPANESE_ADMINS_BASE_URL = 'https://geolonia.github.io/japanese-admins';

/**
 * 都道府県コードまたは市区町村コードから japanese-admins の GeoJSON URL を生成する
 * @param code 都道府県コード（2桁）または市区町村コード（5桁）
 * @returns GeoJSON の URL
 *
 * @example
 * buildJapaneseAdminsUrl('01') // => 'https://geolonia.github.io/japanese-admins/01/01.json'
 * buildJapaneseAdminsUrl('01101') // => 'https://geolonia.github.io/japanese-admins/01/01101.json'
 */
export function buildJapaneseAdminsUrl(code: string): string {
  const prefCode = code.slice(0, 2);
  return `${JAPANESE_ADMINS_BASE_URL}/${prefCode}/${code}.json`;
}

/**
 * 都道府県コードを指定して japanese-admins から都道府県境界の GeoJSON を取得する
 * @param prefCode 都道府県コード（2桁、例: '01'）
 * @returns Promise<GeoJSON.FeatureCollection | null> GeoJSON または null（取得失敗時）
 *
 * @example
 * const hokkaido = await fetchPrefectureGeojson('01'); // 北海道の境界を取得
 */
export async function fetchPrefectureGeojson(
  prefCode: string
): Promise<GeoJSON.FeatureCollection | null> {
  const url = buildJapaneseAdminsUrl(prefCode);
  const data = await fetchJson(url);
  return data;
}

/**
 * 市区町村コードを指定して japanese-admins から市区町村境界の GeoJSON を取得する
 * @param adminCode 市区町村コード（5桁、例: '01101'）
 * @returns Promise<GeoJSON.FeatureCollection | null> GeoJSON または null（取得失敗時）
 *
 * @example
 * const sapporoChuoku = await fetchMunicipalityGeojson('01101'); // 札幌市中央区の境界を取得
 */
export async function fetchMunicipalityGeojson(
  adminCode: string
): Promise<GeoJSON.FeatureCollection | null> {
  const url = buildJapaneseAdminsUrl(adminCode);
  const data = await fetchJson(url);
  return data;
}
