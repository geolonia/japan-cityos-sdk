import maplibregl from 'maplibre-gl';
/**
 * Fill レイヤーのスタイルオプション
 */
export interface FillStyleOptions {
    /** 塗りつぶし色 */
    color?: string;
    /** 塗りつぶし透明度 (0-1) */
    opacity?: number;
    /** アウトライン色 */
    outlineColor?: string;
}
/**
 * 指定した className の Fill レイヤーのスタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーのクラス名（レイヤーIDは `${className}-polygon`）
 * @param style 変更するスタイルオプション
 */
export declare function setFillStyle(map: maplibregl.Map, className: string, style: FillStyleOptions): void;
