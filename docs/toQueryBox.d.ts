export type QueryBoxTarget = [number, number] | [[number, number], [number, number]] | undefined;
/**
 * 任意のtarget（[lng,lat] | {lng,lat} | bbox）をピクセルクエリボックスに変換する
 * @param map maplibregl.Mapインスタンス
 * @param target [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
 * @returns [[x1, y1], [x2, y2]] | null
 */
export declare function toQueryBox(xy: QueryBoxTarget): [[number, number], [number, number]] | null;
