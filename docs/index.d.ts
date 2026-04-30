import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@geolonia/maps-core/css';
import { CircleStyleOptions } from './utils/circleStyleUtils';
import { FillStyleOptions } from './setFillStyle';
import { LineStyleOptions } from './utils/lineStyleUtils';
declare global {
    interface Window {
        geolonia: any;
    }
}
declare class GeoloniaMap extends maplibregl.Map {
    /**
     * 画像マーカー管理用配列
     */
    private imageMarkers;
    private loadedSourceIds;
    static spriteSheetUrl: {
        [key: string]: string;
    };
    private readonly TERRAIN_SOURCE_ID;
    private static readonly HILLSHADE_LAYER_ID;
    private readonly API_KEY;
    constructor(params: any);
    /**
     * osm poiレイヤー名を取得する（日本語キーのみ）
     */
    static getOsmPoiLayers(): string[];
    /**
     * ハザードマップデータのキーを取得する
     */
    static getHazardMapData(): string[];
    /**
     * 国土数値情報データのキーを取得する
     */
    static getNLNIData(): string[];
    /**
     * 鳥取県スマートシティのデータレイヤー一覧を取得する
     */
    static getTottoriData(): Promise<{
        id: string;
        description: string;
    }[]>;
    /**
     * 使用できるアイコン名を取得する
     */
    static getIconNames(spriteKey: string): Promise<string[]>;
    /**
     * 都道府県名一覧を取得（キャッシュ付き）
     */
    static _prefNames: string[] | null;
    static _prefData: {
        [key: string]: any;
    }[] | null;
    static fetchPrefNames(): Promise<string[]>;
    static fetchCityNames(prefName: string): Promise<string[]>;
    /**
     * スプライトシート名を指定してアイコンスタイル一覧を取得する
     * @param spriteKey スプライトシート名（spriteSheetUrlのkey）
     * @returns Promise<{ width: string; height: string; backgroundImage: string; backgroundPosition: string; }[]>
     */
    static getIconStyles(spriteKey: string): Promise<{
        width: string;
        height: string;
        backgroundImage: string;
        backgroundPosition: string;
    }[]>;
    /**
     * 都道府県の中心座標を取得する
     */
    static getLatLngByPrefecture(prefName: string): Promise<[number, number] | null>;
    loadData(className: string, simpleStyle: {
        [key: string]: any;
    } | undefined | null): void;
    loadCSV(url: string, className: string, simpleStyle: {
        [key: string]: any;
    } | undefined | null): Promise<void>;
    loadGeojson(geojson: string | GeoJSON.FeatureCollection, className: string, simpleStyle: {
        [key: string]: any;
    } | undefined | null): Promise<void>;
    removeGeojsonLayer(className: string): void;
    /****************
     * 背景地図のスタイルを切り替える
     * @param styleUrlOrObject スタイルのURLまたはオブジェクト
     ****************/
    setBaseMapStyle(styleUrlOrObject: string | maplibregl.StyleSpecification): void;
    /****************
     * 標高の取得
     * @param lngLat [経度, 緯度]
     ****************/
    getElevation(lngLat?: [number, number]): Promise<number | null>;
    /****************
     * 背景地図以外のレイヤーとソースを削除する
     ****************/
    removeAllCustomLayers(): void;
    /**
     * 画像マーカーを追加する
     * @param imageUrl 画像URL
     * @param args {LAT, LON, NAME}
     */
    addImageMarker(imageUrl: string, lat: number, lon: number, name?: string): void;
    /**
     * 指定した座標・名前の画像マーカーを削除する
     * @param lat 緯度
     * @param lon 経度
     * @param name ラベル名（任意）
     */
    removeImageMarker(lat: number, lon: number, name?: string): void;
    /**
     * 全ての画像マーカーを削除する
     */
    removeAllImageMarkers(): void;
    /**
     * 画像マーカーの幅を変更する
     * @param lat 緯度
     * @param lon 経度
     * @param name ラベル名（任意）
     * @param width 幅(px)
     */
    setImageMarkerWidth(name: string | undefined, width: number): void;
    /**
     * Symbolレイヤーのicon-sizeを変更する
     * @param className レイヤーID（className）
     * @param size icon-sizeの値
     */
    setSymbolIconSize(className: string, size: number): void;
    /**
     * 指定した className の Fill レイヤー（Polygon）のスタイルを変更する
     * @param className レイヤーのクラス名（レイヤーIDは `${className}-polygon`）
     * @param style 変更するスタイルオプション（color, opacity, outlineColor）
     */
    setFillStyle(className: string, style: FillStyleOptions): void;
    /**
     * Line レイヤーの描画スタイルを変更する
     * @param className レイヤーのクラス名（レイヤーIDは `${className}-line`）
     * @param style 変更するスタイルオプション（color, width, opacity）
     */
    setLineStyle(className: string, style: LineStyleOptions): void;
    /**
     * 指定した座標またはbboxのFeatureが存在するか判定する
     * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
     * @param layerIds レイヤーIDまたは配列
     * @returns 存在すればtrue、なければfalse
     */
    hasFeature(xy: [number, number] | [[number, number], [number, number]] | undefined, layerIds?: string | string[]): boolean;
    /**
     * 指定した座標またはbboxのFeatureを取得する
     * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
     * @param layerIds レイヤーIDまたは配列
     * @returns Feature配列
     */
    getFeatures(xy: [number, number] | [[number, number], [number, number]] | undefined, options?: {
        firstOnly?: boolean;
        layerIds?: string | string[];
    }): maplibregl.MapGeoJSONFeature[];
    /**
     * 指定した座標またはbboxのFeatureを取得する
     * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
     * @param layerIds レイヤーIDまたは配列
     * @returns Feature配列
     */
    getFeaturesProperties(xy: [number, number] | [[number, number], [number, number]] | undefined, options?: {
        firstOnly?: boolean;
        layerIds?: string | string[];
    }): {
        [key: string]: any;
    }[];
    /**
     * 指定した種類のpoiを表示する
     * @param osmLayerName 表示するレイヤー名
     */
    loadOsmPoi(osmLayerName: string, spriteName?: keyof typeof GeoloniaMap.spriteSheetUrl): string[];
    /**
     * 指定した種類のpoiを非表示にする
     * @param osmLayerName 非表示にするレイヤー名
     */
    removeOsmPoi(osmLayerName: string): boolean;
    /**
     * 指定したレイヤーIDが存在するかどうかを判定する
     * @param map maplibregl.Mapインスタンス
     * @param layerId レイヤーID
     * @returns 存在すればtrue、なければfalse
     */
    hasLayer(layerId: string): string[];
    /**
    * 指定したPOIレイヤーのスプライトシートを切り替える
    * @param layerName レイヤー名（日本語または英語）
    * @param spriteKey スプライトシート名（spriteSheetUrlのkey）
    */
    changeSpriteSheet(layerName: string, spriteKey: keyof typeof GeoloniaMap.spriteSheetUrl): void;
    /**
     * 指定レイヤーのicon-imageをスプライトシート名付きで変更する
     * @param layerId レイヤーID
     * @param iconName アイコン名（例: "school"）
     * @param spriteKey スプライトシート名（例: "chizubouken-lab"）
     */
    changeLayerIcon(layerId: string, iconName: string, spriteKey: string): void;
    /**
     * ハザードマップデータを表示する
     * @param layerId レイヤーID
     */
    loadHazardMapData(layerId: string): void;
    /**
     * ハザードマップデータを非表示にする
     * @param layerId レイヤーID
     */
    removeHazardMapData(layerId: string): void;
    /**
     * 国土数値情報データを表示する
     * @param layerId レイヤーID
     */
    loadNLNIData(layerId: string): void;
    /**
     * 国土数値情報データを非表示にする
     * @param layerId レイヤーID
     */
    removeNLNIData(layerId: string): void;
    /**
     * 鳥取県スマートシティのデータを表示する
     * @param dataId データID
     */
    loadTottoriData(dataId: string): Promise<void>;
    /**
     * 鳥取県スマートシティのデータを非表示にする
     * @param dataId データID
     */
    removeTottoriData(dataId: string): Promise<void>;
    /**
     * 3D地形表示を有効にする
     */
    show3DTerrain(): void;
    /**
     * 3D地形表示を無効にする（2Dに戻す）
     */
    hide3DTerrain(): void;
    /**
     * Circle レイヤーの描画スタイルを変更する
     * @param className レイヤーID（className）
     * @param style 変更するスタイルオプション（color, radius, strokeColor, strokeWidth, opacity）
     */
    setCircleStyle(className: string, style: CircleStyleOptions): void;
}
export { fetchAdminBoundary, buildJapaneseAdminsUrl, isMunicipalityCode } from './utils/japaneseAdmins';
export { addAdminBoundarySource, addAdminBoundaryLayer, removeAdminBoundaryLayer, AdminBoundaryStyleOptions } from './utils/adminBoundaryUtils';
export { GeoloniaMap };
