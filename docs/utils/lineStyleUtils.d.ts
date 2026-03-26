import maplibregl from 'maplibre-gl';
/**
 * Line レイヤーのスタイルオプション
 */
export interface LineStyleOptions {
    /** 線の色 */
    color?: string;
    /** 線の幅 */
    width?: number;
    /** 線の透過度 (0-1) */
    opacity?: number;
}
/**
 * 指定した Line レイヤーの描画スタイルを変更する
 * @param map maplibregl.Map インスタンス
 * @param className レイヤーのクラス名（レイヤーIDは `${className}-line`）
 * @param style 変更するスタイルオプション
 */
export declare function setLineStyle(map: maplibregl.Map, className: string, style: LineStyleOptions): void;
