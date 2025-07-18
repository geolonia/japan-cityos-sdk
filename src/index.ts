import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createLayer, createSourceByType, csvToGeoJSON, hasLayer, mergeLayersByLoadedIds, mergeSourcesByLoadedIds, parseApiKey, updateLayer } from './utils/mapUtils';
import Papa from 'papaparse';
import { toQueryBox } from './toQueryBox';
import { OsmLayerNameType } from './types';
import { addOsmLayer, addOsmSource, addOsmSprite, removeOsmLayer, toOsmLayerNameType, updateSpriteSheet } from './utils/osmPoiUtils';
import { getOSMLayerConfig } from './utils/osmStyles';

declare global {
  interface Window {
    geolonia: any;
  }
}
	
class GeoloniaMap extends maplibregl.Map {

  private loadedSourceIds: Set<string> = new Set();

  spriteSheetUrl: {[key: string]: string} = {
    'chizubouken-lab': 'https://geolonia.github.io/chizubouken-lab-sprite/sprite',
    'mapfan': 'https://geolonia.github.io/mapfandb-sprite/sprite',
    'smartmap': 'https://geolonia.github.io/custom-smartmap-sprite/sprite',
    'basic': 'https://geoloniamaps.github.io/basic-v1/basic-v1',
  };

  constructor(params: any) {
    const defaults = {
      container: params.container ?? 'map',
      style: params.style ?? 'https://basic-v1-background-only.pages.dev/style.json',
      center: params.lngLat ?? [139.692, 35.689],
      zoom: params.zoom ?? 12,
      hash: params.hash ?? false,
      transformRequest: (url: string, resourceType: string) => {
        if (!window.geolonia.apiKey) { return { url }; }
        if ((resourceType === 'Tile' || resourceType === 'Source') && url.startsWith('https://tileserver.geolonia.com')) {
          const updatedUrl = url.replace('YOUR-API-KEY', window.geolonia.apiKey);
          return { url: updatedUrl };
        }
        return { url };
      }
    }

    super({...defaults, ...params});
  }

  /* ****************
   * レイヤーを追加する
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  loadData(className: string, simpleStyle: { [key: string]: any } | undefined | null) {
    const layers = createLayer(className, {
      simpleStyle: simpleStyle,
      filter: ['==', 'class', className]
    });
    layers.forEach(layer => { this.addLayer(layer, 'poi'); });
  }

  /* ****************
   * csvを読み込んでレイヤーを追加する
   * @param csv CSV文字列
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  async loadCSV (
    url: string, 
    className: string, 
    simpleStyle: { [key: string]: any } | undefined | null
  ) {
    const res = await fetch(url);
    const csv = await res.text();
    const data = Papa.parse(csv, {header: true}).data

    const geojson = csvToGeoJSON(data);

    // すでにSourceが存在する場合はデータを更新
    const existingSource = this.getSource(className) as maplibregl.GeoJSONSource | undefined;
    if (existingSource && 'setData' in existingSource) {
      existingSource.setData(geojson as any);
    } else {
      this.addSource(className, createSourceByType('geojson', geojson));
    }

    const layers = createLayer(className, {
      simpleStyle: simpleStyle
    });
    layers.forEach(layer => { 
      this.addLayer(layer); 
    });

    this.loadedSourceIds.add(className);
  }

  /* ****************
   * geojsonを読み込んでレイヤーを追加する
   * @param csv CSV文字列
   * @param className クラス名
   * @param paint layerのpaintプロパティ
   * @param layout layerのlayoutプロパティ
   * @description
   *   指定したクラス名のレイヤーを追加します。
   * ****************/
  async loadGeojson(
    geojson: string | GeoJSON.FeatureCollection,
    className: string,
    simpleStyle: { [key: string]: any } | undefined | null
  ) {
    // すでにSourceが存在する場合はデータを更新
    const existingSource = this.getSource(className) as maplibregl.GeoJSONSource | undefined;

    if (existingSource && 'setData' in existingSource) {
      existingSource.setData(geojson as any);
    } else {
      this.addSource(className, createSourceByType('geojson', geojson));
    }

    const layers = createLayer(className, {
      simpleStyle: simpleStyle
    });
    const hasLayerFlg = hasLayer(this, className);
    layers.forEach(layer => {
      if (hasLayerFlg) { 
        updateLayer(this, layer); 
      } else {
        this.addLayer(layer); 
      }
    });

    this.loadedSourceIds.add(className);
  }

  /****************
   * 背景地図のスタイルを切り替える
   * @param styleUrlOrObject スタイルのURLまたはオブジェクト
   ****************/
  setBaseMapStyle(styleUrlOrObject: string | maplibregl.StyleSpecification) {
    this.setStyle(styleUrlOrObject, {
      transformStyle: (previousStyle, nextStyle) => {
        const newSources = mergeSourcesByLoadedIds(previousStyle.sources, nextStyle.sources, this.loadedSourceIds);
        const newLayers = mergeLayersByLoadedIds(previousStyle.layers, nextStyle.layers, this.loadedSourceIds);
        return {
          ...previousStyle,
          ...nextStyle,
          sources: newSources,
          layers: newLayers
        };
      }
    });
  }

  /**
   * 指定した座標またはbboxのFeatureが存在するか判定する
   * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
   * @param layerIds レイヤーIDまたは配列
   * @returns 存在すればtrue、なければfalse
   */
  hasFeature(
    xy:  [number, number] | [[number, number], [number, number]] | undefined,
    layerIds?: string | string[]
  ): boolean {
    if (!xy) { return false; }

    const queryBox = toQueryBox(xy);

    if (!queryBox) { return false; }

    const layers = layerIds
      ? Array.isArray(layerIds) ? layerIds : [layerIds]
      : undefined;

    const features = this.queryRenderedFeatures(queryBox, layers ? { layers } : undefined);
    return features.length > 0;
  }

  /**
   * 指定した座標またはbboxのFeatureを取得する
   * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
   * @param layerIds レイヤーIDまたは配列
   * @returns Feature配列
   */
  getFeatures(
    xy: [number, number] | [[number, number], [number, number]] | undefined,
    layerIds?: string | string[]
  ): maplibregl.MapGeoJSONFeature[] {
    if (!xy) { return []; }

    const queryBox = toQueryBox(xy);

    if (!queryBox) { return []; }

    const layers = layerIds
      ? Array.isArray(layerIds) ? layerIds : [layerIds]
      : undefined;

    const features = this.queryRenderedFeatures(queryBox, layers ? { layers } : undefined);
    return features;
  }

  /**
   * 指定した種類のpoiを表示する
   * @param osmLayerName 表示するレイヤー名
   */
  loadOsmPoi(osmLayerName: string, spriteName?: keyof typeof this.spriteSheetUrl): string[] {
    if (!osmLayerName) { return; }
    const layerId = toOsmLayerNameType(osmLayerName);
    if (!layerId) { return; }
    addOsmSource(this);
    addOsmSprite(this, { [spriteName ?? 'basic']: this.spriteSheetUrl[spriteName ?? 'basic'] }, this.spriteSheetUrl);
    const layers = addOsmLayer(this, layerId, spriteName as string);
    return layers;
  }

  /**
   * 指定した種類のpoiを非表示にする
   * @param osmLayerName 非表示にするレイヤー名
   */
  removeOsmPoi(osmLayerName: string) {
    if (!osmLayerName) { return; }
    const layerId = toOsmLayerNameType(osmLayerName);
    if (!layerId) { return; }
    removeOsmLayer(this, layerId);
  }

  getOsmPoiLayers(): Record<OsmLayerNameType, string> {
    return {
      restaurant: 'レストラン',
      railway: '鉄道',
      mountain: '山',
      airport: '空港',
      school: '学校',
      college: '大学',
      convenience: 'コンビニ',
      bank: '銀行',
      hospital: '病院',
      cafe: 'カフェ',
      'fast-food': 'ファストフード',
      zoo: '動物園',
      parking: '駐車場',
      castle: '城',
      museum: '博物館',
      park: '公園'
    };
  }

  /**
   * 指定したレイヤーIDが存在するかどうかを判定する
   * @param map maplibregl.Mapインスタンス
   * @param layerId レイヤーID
   * @returns 存在すればtrue、なければfalse
   */
  hasLayer(layerId: string): string[] | undefined {
    const layerName = toOsmLayerNameType(layerId);
    if (!layerName) { return; }
    const layerIdArr: string[] = [];
    getOSMLayerConfig(layerName, '').forEach(layerConfig => {
      if (this.getLayer(layerConfig.id)) {
        layerIdArr.push(layerConfig.id);
      }
    });
    return layerIdArr.length > 0 ? layerIdArr : undefined;
  }

   /**
   * 指定したPOIレイヤーのスプライトシートを切り替える
   * @param layerName レイヤー名（日本語または英語）
   * @param spriteKey スプライトシート名（spriteSheetUrlのkey）
   */
  changeSpriteSheet(layerName: string, spriteKey: keyof typeof this.spriteSheetUrl) {
    // スプライトを追加・切り替え
    addOsmSprite(this, { [spriteKey]: this.spriteSheetUrl[spriteKey] }, this.spriteSheetUrl);
    // レイヤーを再描画（icon-image式にspriteKeyを渡す）
    updateSpriteSheet(this, layerName, spriteKey as string);
  }

  /**
   * 指定レイヤーのicon-imageをスプライトシート名付きで変更する
   * @param layerId レイヤーID
   * @param iconName アイコン名（例: "school"）
   * @param spriteKey スプライトシート名（例: "chizubouken-lab"）
   */
  changeLayerIcon(layerId: string, iconName: string, spriteKey: string) {
    if (!this.getLayer(layerId)) {
      console.warn(`Layer ${layerId} does not exist.`);
      return;
    }
    // icon-image式 ["concat", spriteKey, ":", iconName] で更新
    const iconImageExpr = ["concat", spriteKey, ":", iconName];
    this.setLayoutProperty(layerId, "icon-image", iconImageExpr);
  }

}

const currentScript = document.currentScript as HTMLScriptElement;

window.geolonia = {}
window.geolonia.apiKey = parseApiKey(currentScript);
window.geolonia.japan = maplibregl;
window.geolonia.japan.Map = GeoloniaMap;
window.geolonia.japan.Popup = maplibregl.Popup;
