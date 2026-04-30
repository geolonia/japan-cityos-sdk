/**
 * 市区町村コード（5桁）かどうかを判定する
 * @param code チェックするコード
 * @returns 有効な市区町村コードならtrue
 */
export declare function isMunicipalityCode(code: string): boolean;
/**
 * 市区町村コードから japanese-admins の GeoJSON URL を生成する
 * @param municipalityCode 市区町村コード（5桁）
 * @returns GeoJSON URL、無効なコードの場合は null
 *
 * @example
 * buildJapaneseAdminsUrl('01101') // => 'https://geolonia.github.io/japanese-admins/01/01101.json'
 */
export declare function buildJapaneseAdminsUrl(municipalityCode: string): string | null;
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
export declare function fetchAdminBoundary(municipalityCode: string): Promise<GeoJSON.FeatureCollection | null>;
