import { fetchJson } from './fetchJson';

/**
 * 都道府県コードの基本URL
 */
const JAPANESE_ADMINS_BASE_URL = 'https://geolonia.github.io/japanese-admins';

/**
 * 市区町村コード（5桁）かどうかを判定する
 * @param code チェックするコード
 * @returns 有効な市区町村コードならtrue
 */
export function isMunicipalityCode(code: string): boolean {
  if (!code || code.length !== 5) {
    return false;
  }
  // 数字のみで構成されているかチェック
  const isNumeric = /^\d{5}$/.test(code);
  if (!isNumeric) {
    return false;
  }

  // 都道府県コード部分（最初の2桁）が01〜47の範囲内かチェック
  const prefCode = parseInt(code.substring(0, 2), 10);
  return prefCode >= 1 && prefCode <= 47;
}

/**
 * 市区町村コードから japanese-admins の GeoJSON URL を生成する
 * @param municipalityCode 市区町村コード（5桁）
 * @returns GeoJSON URL、無効なコードの場合は null
 *
 * @example
 * buildJapaneseAdminsUrl('01101') // => 'https://geolonia.github.io/japanese-admins/01/01101.json'
 */
export function buildJapaneseAdminsUrl(municipalityCode: string): string | null {
  if (!isMunicipalityCode(municipalityCode)) {
    return null;
  }

  const prefCode = municipalityCode.substring(0, 2);
  return `${JAPANESE_ADMINS_BASE_URL}/${prefCode}/${municipalityCode}.json`;
}

/**
 * japanese-admins から行政区画境界の GeoJSON を取得する
 * @param municipalityCode 市区町村コード（5桁）
 * @returns GeoJSON FeatureCollection、取得失敗時は null
 *
 * @example
 * // 北海道札幌市中央区の境界データを取得
 * const geojson = await fetchAdminBoundary('01101');
 *
 * @example
 * // 東京都千代田区の境界データを取得
 * const geojson = await fetchAdminBoundary('13101');
 */
export async function fetchAdminBoundary(
  municipalityCode: string
): Promise<GeoJSON.FeatureCollection | null> {
  const url = buildJapaneseAdminsUrl(municipalityCode);
  if (!url) {
    return null;
  }

  try {
    const data = await fetchJson(url);
    if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
      return data as GeoJSON.FeatureCollection;
    }
    return null;
  } catch {
    return null;
  }
}
