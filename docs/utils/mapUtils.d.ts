import type { FeatureCollection } from "geojson";
/**
 * Parses the API key from the URL of the current script tag.
 *
 * @param {HTMLScriptElement} script - The current script tag.
 */
export declare const parseApiKey: (script: HTMLScriptElement) => string;
export declare const csvToGeoJSON: (data: any[]) => FeatureCollection;
export declare const createSourceByType: (type: 'geojson' | 'vector' | 'raster', data: any | undefined) => maplibregl.SourceSpecification | undefined;
export declare function hasLayer(map: maplibregl.Map, layerId: string): boolean;
/**
 * 指定された情報からpoint/symbol, line, polygonレイヤーのLayer定義を返す
 * @param className クラス名（レイヤーIDにも利用）
 * @param options.simpleStyle シンボルや色などのスタイル指定
 * @param options.sourceLayer 任意のsource-layer名
 * @param options.filter 任意のfilter
 * @returns maplibregl.LayerSpecification[]
 */
export declare const createLayer: (className: string, options?: {
    simpleStyle?: {
        [key: string]: any;
    };
    sourceLayer?: string;
    filter?: maplibregl.FilterSpecification;
}) => maplibregl.LayerSpecification[];
/**
 * 既存のレイヤーのlayoutやpaintプロパティを更新する
 * @param map maplibregl.Mapインスタンス
 * @param layer maplibregl.LayerSpecification
 */
export declare function updateLayer(map: maplibregl.Map, layer: maplibregl.LayerSpecification): void;
/**
 * previousStyle.sourcesから、loadedSourceIdsに含まれるsourceのみを抽出し、nextStyle.sourcesをマージして返す
 * @param previousSources - 前のスタイルのsources
 * @param nextSources - 次のスタイルのsources
 * @param loadedSourceIds - 読み込まれたsourceのIDのセット
 * @returns マージされたsources
 */
export declare function mergeSourcesByLoadedIds(previousSources: Record<string, any>, nextSources: Record<string, any>, loadedSourceIds: Set<string>): Record<string, any>;
/**
 * previousStyle.layersから、loadedSourceIdsに含まれるsourceを持つlayerのみ抽出し、nextStyle.layersを先頭にマージして返す
 * @param previousLayers - 前のスタイルのlayers
 * @param nextLayers - 次のスタイルのlayers
 * @param loadedSourceIds - 読み込まれたsourceのIDのセット
 * @returns マージされたlayers
 */
export declare function mergeLayersByLoadedIds(previousLayers: any[], nextLayers: any[], loadedSourceIds: Set<string>): any[];
/**
 * 背景地図以外の全てのソースを削除する
 */
export declare function removeSourcesByLoadedIds(sources: Record<string, maplibregl.SourceSpecification>, loadedSourceIds: Set<string>): {
    [k: string]: import("maplibre-gl").SourceSpecification;
};
/**
 * 背景地図以外の全てのレイヤーを削除する
 */
export declare function removeLayersByLoadedIds(layers: maplibregl.LayerSpecification[], loadedSourceIds: Set<string>): import("maplibre-gl").LayerSpecification[];
