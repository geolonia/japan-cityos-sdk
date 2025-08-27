import maplibregl from "maplibre-gl";
export declare function createSymbolLayer(className: string, simpleStyle: {
    [key: string]: any;
}, options?: {
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}): maplibregl.SymbolLayerSpecification;
export declare function createCircleLayer(className: string, simpleStyle: {
    [key: string]: any;
}, options?: {
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}): maplibregl.CircleLayerSpecification;
export declare function createLineLayer(className: string, simpleStyle: {
    [key: string]: any;
}, options?: {
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}): maplibregl.LineLayerSpecification;
export declare function createFillLayer(className: string, simpleStyle?: {
    [key: string]: any;
}, options?: {
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}): maplibregl.FillLayerSpecification;
/**
 * geometryTypeの配列・スタイル・オプションから、geometryTypeごとに適切なレイヤーを作成する
 * @param className レイヤーID
 * @param geometryTypes geometryTypeの配列（例: ['Point', 'LineString']）
 * @param simpleStyle スタイル情報（任意）
 * @param options sourceLayerやfilterなど（任意）
 * @returns maplibregl.LayerSpecification[]（geometryTypeごとに必要なレイヤーのみ返す）
 */
export declare function createLayersByGeometryTypes(className: string, geometryTypes: string[], simpleStyle?: {
    [key: string]: any;
}, options?: {
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}): maplibregl.LayerSpecification[];
