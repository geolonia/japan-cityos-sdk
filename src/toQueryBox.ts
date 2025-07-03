
export type QueryBoxTarget = [number, number] | [[number, number], [number, number]] | undefined;

/**
 * 任意のtarget（[lng,lat] | {lng,lat} | bbox）をピクセルクエリボックスに変換する
 * @param map maplibregl.Mapインスタンス
 * @param target [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
 * @returns [[x1, y1], [x2, y2]] | null
 */
export function toQueryBox(xy: QueryBoxTarget): [[number, number], [number, number]] | null {
    if (!xy || xy.length < 2 || !Array.isArray(xy)) { return null; }

    let queryBox: [[number, number], [number, number]];

    if (Array.isArray(xy) && xy.length === 2 && typeof xy[0] === 'number' && typeof xy[1] === 'number') {
        // [x, y]
        if (Number.isNaN(xy[0]) || Number.isNaN(xy[1])) { return null; }
        queryBox = [
            [xy[0] - 1, xy[1] - 1],
            [xy[0] + 1, xy[1] + 1]
        ];

    } else if (Array.isArray(xy) && xy.length === 2 && Array.isArray(xy[0]) && Array.isArray(xy[1])) {
        // bbox: [[minX, minY], [maxX, maxY]]
        queryBox = xy as [[number, number], [number, number]];

    }

    return queryBox;

}
