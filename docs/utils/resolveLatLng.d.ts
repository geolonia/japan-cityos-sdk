/**
 * 住所文字列から [lng, lat] 座標を解決する共通ヘルパー
 * @param address 住所文字列（都道府県名、または都道府県+市区町村名）
 * @returns [lng, lat] のタプル、取得できない場合は null
 */
export declare function resolveLatLng(address: string): Promise<[number, number] | null>;
