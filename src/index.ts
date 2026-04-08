import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createLayer, createSourceByType, csvToGeoJSON, hasLayer, mergeLayersByLoadedIds, mergeSourcesByLoadedIds, parseApiKey, removeLayersByLoadedIds, removeSourcesByLoadedIds, setSymbolIconSize as _setSymbolIconSize, updateLayer } from './utils/mapUtils';
import Papa from 'papaparse';
import { toQueryBox } from './toQueryBox';
import { normalize } from '@geolonia/normalize-japanese-addresses';
import { resolveLatLng } from './utils/resolveLatLng';
import { addOsmLayer, addOsmSource, addOsmSprite, getJapaneseOsmLayerNames, removeOsmLayer, toOsmLayerNameType, updateSpriteSheet } from './utils/osmPoiUtils';
import { getOSMLayerConfig } from './utils/osmStyles';
import { existsSpriteIcon, getSpriteIconNames, getSpriteIconStyles } from './utils/spriteUtils';
import { addHazardMapLayer, addHazardMapSource, getHazardMapKeys, removeHazardMapLayer } from './utils/hazardmapUtils';
import { addNLNILayer, addNLNISource, getNLNIKeys, removeNLNILayer } from './utils/nationalLandNumericalInformationUtils';
import { addTerrainSource, addHillshadeLayer, TERRAIN_SOURCE_ID, HILLSHADE_LAYER_ID } from './utils/terrainUtils';
import { addOrUpdateGeojsonSource } from './utils/sourceUtils';
import { addOrUpdateLayers, getLayerIdsBySource } from './utils/layerUtils';
import { getGeometryTypes, parseGeojsonInput } from './utils/geojsonUtils';
import { fetchJson } from './utils/fetchJson';
import { setCircleStyle as _setCircleStyle, CircleStyleOptions } from './utils/circleStyleUtils';
import { setFillStyle as applyFillStyle, FillStyleOptions } from './setFillStyle';
import { setLineStyle, LineStyleOptions } from './utils/lineStyleUtils';
import { fetchTottoriDataIndex, addTottoriDataSource, addTottoriDataLayer, removeTottoriDataLayer, TottoriDataEntry } from './utils/tottoriDataUtils';

declare global {
  interface Window {
    geolonia: any;
  }
}
	
class GeoloniaMap extends maplibregl.Map {
  /**
   * 画像マーカー管理用配列
   */
  private imageMarkers: Array<{
    marker: any;
    lat: number;
    lon: number;
    name?: string;
  }> = [];

  private loadedSourceIds: Set<string> = new Set();

  static spriteSheetUrl: {[key: string]: string} = {
    'chizubouken-lab': 'https://geolonia.github.io/chizubouken-lab-sprite/sprite',
    'mapfan': 'https://geolonia.github.io/mapfandb-sprite/sprite',
    'smartmap': 'https://geolonia.github.io/custom-smartmap-sprite/sprite',
    'basic': 'https://geoloniamaps.github.io/basic-v1/basic-v1',
  };

  // 3D地形用のソース・レイヤーID（クラス内共通で利用）
  private readonly TERRAIN_SOURCE_ID = "dem";
  private static readonly HILLSHADE_LAYER_ID = "hillshading";

  private readonly API_KEY = window.geolonia.API_KEY || '';

  constructor(params: any) {
    const defaults = {
      container: params.container ?? 'map',
      style: params.style ?? 'https://basic-v1-background-only.pages.dev/style.json',
      center: params.lngLat ?? [139.692, 35.689],
      zoom: params.zoom ?? 12,
      hash: params.hash ?? false,
      minZoom: params.minZoom ?? 8,
      maxZoom: params.maxZoom ?? 20,
      transformRequest: (url: string, resourceType: string) => {
        if (!window.geolonia.API_KEY) { return { url }; }
        if ((resourceType === 'Tile' || resourceType === 'Source') && url.startsWith('https://tileserver.geolonia.com')) {
          const updatedUrl = url.replace('YOUR-API-KEY', window.geolonia.API_KEY);
          return { url: updatedUrl };
        }
        return { url };
      }
    }

    super({...defaults, ...params});
  }

  /**
   * osm poiレイヤー名を取得する（日本語キーのみ）
   */
  static getOsmPoiLayers(): string[] {
    return getJapaneseOsmLayerNames();
  }

  /**
   * ハザードマップデータのキーを取得する
   */
  static getHazardMapData(): string[] {
    return getHazardMapKeys();
  }

  /**
   * 国土数値情報データのキーを取得する
   */
  static getNLNIData(): string[] {
    return getNLNIKeys();
  }

  /**
   * 鳥取県スマートシティのデータレイヤー一覧を取得する
   */
  static async getTottoriData(): Promise<{ id: string; description: string }[]> {
    const entries = await fetchTottoriDataIndex();
    return entries.map(e => ({ id: e.id, description: e.description }));
  }

  /**
   * 使用できるアイコン名を取得する
   */
  static async getIconNames(spriteKey: string): Promise<string[]> {
    const iconNames = await getSpriteIconNames(GeoloniaMap.spriteSheetUrl[spriteKey]);
    return iconNames;
  }


  /**
   * 都道府県名一覧を取得（キャッシュ付き）
   */
  static _prefNames: string[] | null = null;
  static _prefData: {[key: string]: any}[] | null = null;
  static async fetchPrefNames(): Promise<string[]> {
    if (GeoloniaMap._prefNames) { return GeoloniaMap._prefNames; }
    const json = await fetchJson('https://japanese-addresses-v2.geoloniamaps.com/api/ja.json');
    GeoloniaMap._prefData = json || null;
    if (!json.data || !Array.isArray(json.data)) { return []; }
    GeoloniaMap._prefNames = json.data.map((item: any) => item.pref);
    return GeoloniaMap._prefNames;
  }

  static async fetchCityNames(prefName: string): Promise<string[]> {
    const json = GeoloniaMap._prefData ? GeoloniaMap._prefData : await fetchJson('https://japanese-addresses-v2.geoloniamaps.com/api/ja.json');
    if (!json.data || !Array.isArray(json.data)) { return []; }
    const prefObj = json.data.find((item: any) => item.pref === prefName);
    if (!prefObj) { return []; }
    // 市名の重複を除外して返す
    const cityNames = prefObj.cities.map((item: any) => item.city);
    return Array.from(new Set(cityNames));
  }

  /**
   * スプライトシート名を指定してアイコンスタイル一覧を取得する
   * @param spriteKey スプライトシート名（spriteSheetUrlのkey）
   * @returns Promise<{ width: string; height: string; backgroundImage: string; backgroundPosition: string; }[]>
   */
  static async getIconStyles(spriteKey: string): Promise<{
    width: string;
    height: string;
    backgroundImage: string;
    backgroundPosition: string;
  }[]> {
    const url = GeoloniaMap.spriteSheetUrl[spriteKey];
    if (!url) return [];
    return await getSpriteIconStyles(url);
  }

  /**
   * 都道府県の中心座標を取得する
   */
  static async getLatLngByPrefecture(prefName: string): Promise<[number, number] | null> {
    return resolveLatLng(prefName);
  }

  /**
   * 都道府県+市区町村の中心座標を取得する
   */
  static async getLatLngByCity(prefName: string, cityName: string): Promise<[number, number] | null> {
    return resolveLatLng(prefName + cityName);
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

    const parsedGeojson = parseGeojsonInput(geojson);

    if(!parsedGeojson) {
      console.error('Invalid GeoJSON data');
      return;
    }

    addOrUpdateGeojsonSource(this, className, parsedGeojson);

    const spriteSheet = simpleStyle?.['sprite-sheet'];
    if (spriteSheet) {
      addOsmSprite(this, { [spriteSheet]: GeoloniaMap.spriteSheetUrl[spriteSheet] }, GeoloniaMap.spriteSheetUrl);
    }

    const geometryTypes = getGeometryTypes(parsedGeojson);
    addOrUpdateLayers(this, className, geometryTypes, simpleStyle);

    this.loadedSourceIds.add(className);
  }

  removeGeojsonLayer(className: string) {
    // レイヤー削除
    const layers = this.getStyle().layers;
    if (layers) {
      getLayerIdsBySource(layers, className).forEach(layerId => {
        if (this.getLayer(layerId)) {
          this.removeLayer(layerId);
        }
      });
    }
    // ソース削除
    if (this.getSource(className)) {
      this.removeSource(className);
    }
    // loadedSourceIds からも削除
    this.loadedSourceIds.delete(className);
  }


  /****************
   * 背景地図のスタイルを切り替える
   * @param styleUrlOrObject スタイルのURLまたはオブジェクト
   ****************/
  setBaseMapStyle(styleUrlOrObject: string | maplibregl.StyleSpecification) {
    // 3D地形の状態を保持
    const terrainState = this.getTerrain();
    const hadTerrain = !!terrainState;

    this.setStyle(styleUrlOrObject, {
      transformStyle: (previousStyle, nextStyle) => {
        const newSources = mergeSourcesByLoadedIds(previousStyle.sources, nextStyle.sources, this.loadedSourceIds);
        const newLayers = mergeLayersByLoadedIds(previousStyle.layers, nextStyle.layers, this.loadedSourceIds);

        // terrain用のソースとレイヤーを保持
        const terrainSourceId = terrainState?.source ?? this.TERRAIN_SOURCE_ID;
        if (terrainSourceId && hadTerrain) {
          if (previousStyle.sources[terrainSourceId]) {
            newSources[terrainSourceId] = previousStyle.sources[terrainSourceId];
          }
          const hillshadeLayerId = GeoloniaMap.HILLSHADE_LAYER_ID;
          if (!newLayers.some(l => l.id === hillshadeLayerId)) {
            const hillshadeLayer = previousStyle.layers.find(l => l.id === hillshadeLayerId);
            if (hillshadeLayer) {
              newLayers.push(hillshadeLayer);
            }
          }
        }

        const canRestoreTerrain = hadTerrain && !!terrainSourceId && !!newSources[terrainSourceId];
        return {
          ...previousStyle,
          ...nextStyle,
          sources: newSources,
          layers: newLayers,
          ...(canRestoreTerrain ? { terrain: { source: terrainSourceId, exaggeration: terrainState.exaggeration ?? 1 } } : {})
        };
      }
    });
  }

  /****************
   * 標高の取得
   * @param lngLat [経度, 緯度]
   ****************/
  async getElevation(lngLat: [number, number] = this.getCenter().toArray()): Promise<number | null> {
    if (!this.getTerrain()) {
      addTerrainSource(this, this.API_KEY);
      this.setTerrain({ source: this.TERRAIN_SOURCE_ID, exaggeration: 1 });
      await new Promise<void>(resolve => {
        this.once('styledata', () => resolve());
      });
    }
    return this.queryTerrainElevation(lngLat);
  }

  /****************
   * 背景地図以外のレイヤーとソースを削除する
   ****************/
  removeAllCustomLayers() {
    const style = this.getStyle();
    const newSources = removeSourcesByLoadedIds(style.sources, this.loadedSourceIds);
    const newLayers = removeLayersByLoadedIds(style.layers, this.loadedSourceIds);

    this.setStyle({
      ...style,
      sources: newSources,
      layers: newLayers
    });
  }

  /**
   * 画像マーカーを追加する
   * @param imageUrl 画像URL
   * @param args {LAT, LON, NAME}
   */
  addImageMarker(imageUrl: string, lat: number, lon: number, name?: string) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = name || 'image marker';
    img.width = 100;
    img.style.objectFit = 'contain';
    img.className = 'marker-img';

    const label = document.createElement('span');
    label.textContent = name || '';
    label.className = 'marker-label';

    container.appendChild(img);
    container.appendChild(label);

    const marker = new window.geolonia.japan.Marker({element: container})
      .setLngLat([lat, lon])
      .addTo(this);
    (container as any).__marker = marker;

    // 管理配列に追加
    this.imageMarkers.push({ marker, lat, lon, name });
  }

  /**
   * 指定した座標・名前の画像マーカーを削除する
   * @param lat 緯度
   * @param lon 経度
   * @param name ラベル名（任意）
   */
  removeImageMarker(lat: number, lon: number, name?: string) {
    // 管理配列から該当マーカーのみ削除
    this.imageMarkers = this.imageMarkers.filter(item => {
      const matches = item.lat === lat && item.lon === lon && (!name || item.name === name);
      if (matches) {
        item.marker.remove();
        return false; // 削除
      }
      return true; // 残す
    });
  }

  /**
   * 全ての画像マーカーを削除する
   */
  removeAllImageMarkers() {
    this.imageMarkers.forEach(item => item.marker.remove());
    this.imageMarkers = [];
  }

  /**
   * 画像マーカーの幅を変更する
   * @param lat 緯度
   * @param lon 経度
   * @param name ラベル名（任意）
   * @param width 幅(px)
   */
  setImageMarkerWidth(name: string | undefined, width: number) {
    this.imageMarkers.forEach(item => {
      if (!name || item.name === name) {
        const img = item.marker.getElement().querySelector('.marker-img') as HTMLImageElement;
        if (img) {
          img.width = width;
        }
      }
    });
  }

  /**
   * Symbolレイヤーのicon-sizeを変更する
   * @param className レイヤーID（className）
   * @param size icon-sizeの値
   */
  setSymbolIconSize(className: string, size: number) {
    _setSymbolIconSize(this, className, size);
  }

  /**
   * 指定した className の Fill レイヤー（Polygon）のスタイルを変更する
   * @param className レイヤーのクラス名（レイヤーIDは `${className}-polygon`）
   * @param style 変更するスタイルオプション（color, opacity, outlineColor）
   */
  setFillStyle(className: string, style: FillStyleOptions) {
    applyFillStyle(this, className, style);
  }

  /**
   * Line レイヤーの描画スタイルを変更する
   * @param className レイヤーのクラス名（レイヤーIDは `${className}-line`）
   * @param style 変更するスタイルオプション（color, width, opacity）
   */
  setLineStyle(className: string, style: LineStyleOptions) {
    setLineStyle(this, className, style);
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
    options?: { 
      firstOnly?: boolean;
      layerIds?: string | string[];
    }
  ): maplibregl.MapGeoJSONFeature[] {
    if (!xy) { return []; }
    const layerIds = options?.layerIds;
    const firstOnly = options?.firstOnly ?? false;

    const queryBox = toQueryBox(xy);

    if (!queryBox) { return []; }

    const layers = layerIds
      ? Array.isArray(layerIds) ? layerIds : [layerIds]
      : undefined;

    const features = this.queryRenderedFeatures(queryBox, layers ? { layers } : undefined);
    return firstOnly ? [features[0]] : features;
  }

  /**
   * 指定した座標またはbboxのFeatureを取得する
   * @param xy [lng,lat] | {lng,lat} | [[minLng,minLat],[maxLng,maxLat]]
   * @param layerIds レイヤーIDまたは配列
   * @returns Feature配列
   */
  getFeaturesProperties(
    xy: [number, number] | [[number, number], [number, number]] | undefined,
    options?: { 
      firstOnly?: boolean;
      layerIds?: string | string[];
    }
  ): { [key: string]: any }[] {
    if (!xy) { return []; }
    const layerIds = options?.layerIds;
    const firstOnly = options?.firstOnly ?? false;

    const features = this.getFeatures(xy, { layerIds, firstOnly });

    // propertiesが空でないものだけ返す
    return features.filter(
      f => f && f.properties && Object.keys(f.properties).length > 0
    ).map(f => ({
      layerId: f.layer.id,
      properties: f.properties
    }));
  }

  /**
   * 指定した種類のpoiを表示する
   * @param osmLayerName 表示するレイヤー名
   */
  loadOsmPoi(osmLayerName: string, spriteName?: keyof typeof GeoloniaMap.spriteSheetUrl): string[] {
    if (!osmLayerName) { return; }
    const layerId = toOsmLayerNameType(osmLayerName);
    if (!layerId) { return; }
    const sourceId = addOsmSource(this);
    if(sourceId) {
      this.loadedSourceIds.add(sourceId);
    }
    addOsmSprite(
      this,
      { [(spriteName ?? 'basic')]: GeoloniaMap.spriteSheetUrl[(spriteName ?? 'basic')] },
      GeoloniaMap.spriteSheetUrl
    );
    const layers = addOsmLayer(this, layerId, spriteName as string);
    return layers;
  }

  /**
   * 指定した種類のpoiを非表示にする
   * @param osmLayerName 非表示にするレイヤー名
   */
  removeOsmPoi(osmLayerName: string): boolean {
    if (!osmLayerName) { return false; }
    const layerId = toOsmLayerNameType(osmLayerName);
    if (!layerId) { return false; }
    const before = this.hasLayer(layerId);
    removeOsmLayer(this, layerId);
    const after = this.hasLayer(layerId);
    // 削除前に存在し、削除後に存在しなければtrue
    return !!before && !after;
  }

  /**
   * 指定したレイヤーIDが存在するかどうかを判定する
   * @param map maplibregl.Mapインスタンス
   * @param layerId レイヤーID
   * @returns 存在すればtrue、なければfalse
   */
  hasLayer(layerId: string): string[] {
    const layerName = toOsmLayerNameType(layerId);
    if (!layerName) { return []; }
    const layerIdArr: string[] = [];
    getOSMLayerConfig(layerName, '').forEach(layerConfig => {
      if (this.getLayer(layerConfig.id)) {
        layerIdArr.push(layerConfig.id);
      }
    });
    return layerIdArr.length > 0 ? layerIdArr : [];
  }

   /**
   * 指定したPOIレイヤーのスプライトシートを切り替える
   * @param layerName レイヤー名（日本語または英語）
   * @param spriteKey スプライトシート名（spriteSheetUrlのkey）
   */
  changeSpriteSheet(layerName: string, spriteKey: keyof typeof GeoloniaMap.spriteSheetUrl) {
    // スプライトを追加・切り替え
    addOsmSprite(this, { [spriteKey]: GeoloniaMap.spriteSheetUrl[spriteKey] }, GeoloniaMap.spriteSheetUrl);
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

    existsSpriteIcon(GeoloniaMap.spriteSheetUrl[spriteKey], iconName)
    .then((hasSprite) => {
      if (!hasSprite) {
        console.warn(`Icon "${iconName}" does not exist in sprite "${spriteKey}".`);
        return;
      }
      // icon-image式 ["concat", spriteKey, ":", iconName] で更新
      const iconImageExpr = ["concat", spriteKey, ":", iconName];
      this.setLayoutProperty(layerId, "icon-image", iconImageExpr);
    })
    .catch(() => {
      console.error(`Failed to check icon "${iconName}" in sprite "${spriteKey}".`);
    });
  }

  /**
   * ハザードマップデータを表示する
   * @param layerId レイヤーID
   */
  loadHazardMapData(layerId: string) {
    if (!getHazardMapKeys().includes(layerId)) {
      console.warn(`Hazard map data for ${layerId} not found.`);
      return;
    }
    
    const sourceId = addHazardMapSource(this, layerId);
    if(sourceId) {
      this.loadedSourceIds.add(sourceId);
    }
    addHazardMapLayer(this, layerId);
  }

  /**
   * ハザードマップデータを非表示にする
   * @param layerId レイヤーID
   */
  removeHazardMapData(layerId: string) {
    if (!getHazardMapKeys().includes(layerId)) {
      console.warn(`Hazard map data for ${layerId} not found.`);
      return;
    }
    
    removeHazardMapLayer(this, layerId);
  }

  /**
   * 国土数値情報データを表示する
   * @param layerId レイヤーID
   */
  loadNLNIData(layerId: string) {
    if (!getNLNIKeys().includes(layerId)) {
      console.warn(`国土数値情報データ for ${layerId} not found.`);
      return;
    }

    const sourceId = addNLNISource(this, layerId);
    if(sourceId) {
      this.loadedSourceIds.add(sourceId);
    }
    addNLNILayer(this, layerId);
  }
  
  /**
   * 国土数値情報データを非表示にする
   * @param layerId レイヤーID
   */
  removeNLNIData(layerId: string) {
    if (!getNLNIKeys().includes(layerId)) {
      console.warn(`国土数値情報データ for ${layerId} not found.`);
      return;
    }
    
    removeNLNILayer(this, layerId);
  }

  /**
   * 鳥取県スマートシティのデータを表示する
   * @param dataId データID
   */
  async loadTottoriData(dataId: string) {
    const entries = await fetchTottoriDataIndex();
    const entry = entries.find(e => e.id === dataId);
    if (!entry) {
      console.warn(`鳥取県データ ID: ${dataId} が見つかりません`);
      return;
    }

    const sourceId = addTottoriDataSource(this, entry);
    if (sourceId) {
      this.loadedSourceIds.add(sourceId);
    }
    addTottoriDataLayer(this, entry);
  }

  /**
   * 鳥取県スマートシティのデータを非表示にする
   * @param dataId データID
   */
  async removeTottoriData(dataId: string) {
    const entries = await fetchTottoriDataIndex();
    const entry = entries.find(e => e.id === dataId);
    if (!entry) {
      console.warn(`鳥取県データ ID: ${dataId} が見つかりません`);
      return;
    }

    const removedSourceId = removeTottoriDataLayer(this, entry);
    if (removedSourceId) {
      this.loadedSourceIds.delete(removedSourceId);
    }
  }

  /**
   * 3D地形表示を有効にする
   */
  show3DTerrain() {
    addTerrainSource(this, this.API_KEY);
    if (this.getLayer(HILLSHADE_LAYER_ID)) {
      this.removeLayer(HILLSHADE_LAYER_ID);
    }
    addHillshadeLayer(this);
    this.setTerrain({ source: this.TERRAIN_SOURCE_ID, exaggeration: 1 });
  }

  /**
   * 3D地形表示を無効にする（2Dに戻す）
   */
  hide3DTerrain() {
    const hillshadeLayerId = GeoloniaMap.HILLSHADE_LAYER_ID;
    this.setTerrain(null);
    if (this.getLayer(hillshadeLayerId)) {
      this.removeLayer(hillshadeLayerId);
    }
  }

  /**
   * Circle レイヤーの描画スタイルを変更する
   * @param className レイヤーID（className）
   * @param style 変更するスタイルオプション（color, radius, strokeColor, strokeWidth, opacity）
   */
  setCircleStyle(className: string, style: CircleStyleOptions) {
    _setCircleStyle(this, className, style);
  }
}

const currentScript = document.currentScript as HTMLScriptElement | null;
window.geolonia = window.geolonia || {};
window.geolonia.API_KEY = parseApiKey(currentScript || undefined) || "";
window.geolonia.japan = maplibregl;
window.geolonia.japan.Map = GeoloniaMap;
window.geolonia.japan.Popup = maplibregl.Popup;
