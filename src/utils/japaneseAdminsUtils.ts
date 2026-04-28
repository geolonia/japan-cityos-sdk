import { fetchJson } from './fetchJson';

const JAPANESE_ADMINS_BASE_URL = 'https://geolonia.github.io/japanese-admins';

/**
 * 都道府県コード（2桁）のバリデーション
 * @param code 都道府県コード
 * @returns バリデーション結果
 */
function validatePrefectureCode(code: string): boolean {
  return /^\d{2}$/.test(code);
}

/**
 * 市区町村コード（5桁）のバリデーション
 * @param code 市区町村コード
 * @returns バリデーション結果
 */
function validateMunicipalityCode(code: string): boolean {
  return /^\d{5}$/.test(code);
}

/**
 * GeoJSON.FeatureCollection の型ガード
 * @param data チェック対象のデータ
 * @returns FeatureCollection かどうか
 */
function isFeatureCollection(data: unknown): data is GeoJSON.FeatureCollection {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    data.type === 'FeatureCollection' &&
    'features' in data &&
    Array.isArray((data as { features: unknown }).features)
  );
}

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
 * @returns Promise<GeoJSON.FeatureCollection | null> GeoJSON または null（取得失敗時・バリデーションエラー時）
 *
 * @example
 * const hokkaido = await fetchPrefectureGeojson('01'); // 北海道の境界を取得
 */
export async function fetchPrefectureGeojson(
  prefCode: string
): Promise<GeoJSON.FeatureCollection | null> {
  // 入力バリデーション
  if (!validatePrefectureCode(prefCode)) {
    return null;
  }

  const url = buildJapaneseAdminsUrl(prefCode);
  const data = await fetchJson(url);

  // FeatureCollection の型チェック
  return isFeatureCollection(data) ? data : null;
}

/**
 * 市区町村コードを指定して japanese-admins から市区町村境界の GeoJSON を取得する
 * @param adminCode 市区町村コード（5桁、例: '01101'）
 * @returns Promise<GeoJSON.FeatureCollection | null> GeoJSON または null（取得失敗時・バリデーションエラー時）
 *
 * @example
 * const sapporoChuoku = await fetchMunicipalityGeojson('01101'); // 札幌市中央区の境界を取得
 */
export async function fetchMunicipalityGeojson(
  adminCode: string
): Promise<GeoJSON.FeatureCollection | null> {
  // 入力バリデーション
  if (!validateMunicipalityCode(adminCode)) {
    return null;
  }

  const url = buildJapaneseAdminsUrl(adminCode);
  const data = await fetchJson(url);

  // FeatureCollection の型チェック
  return isFeatureCollection(data) ? data : null;
}
