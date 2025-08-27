/**
 * geometryTypes・className・simpleStyleからレイヤーを作成し、マップに追加または更新する
 * @param map maplibregl.Mapインスタンス
 * @param className レイヤーID
 * @param geometryTypes geometryTypeの配列
 * @param simpleStyle スタイル情報（任意）
 */
export declare function addOrUpdateLayers(map: maplibregl.Map, className: string, geometryTypes: string[], simpleStyle?: {
    [key: string]: any;
}): void;
