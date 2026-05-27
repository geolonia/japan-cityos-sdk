# API Reference

## GeoloniaMap クラス

`@geolonia/maps-core` の `GeoloniaMap` を拡張したメインクラス。`geolonia.japan.Map` としてグローバルに公開される。

---

## データ読み込み

### `loadCSV(url, className, simpleStyle?)`

CSV ファイルを読み込み、GeoJSON に変換して地図上に表示する。

- **url** `string` — CSV ファイルの URL
- **className** `string` — レイヤー名（ソース ID としても使用）
- **simpleStyle** `object` — SimpleStyle 形式のスタイル指定（任意）

CSV の緯度・経度カラムは以下の名前を自動検出する: `lat`/`lng`, `latitude`/`longitude`, `緯度`/`経度` など。

### `loadGeojson(geojson, className, simpleStyle?)`

GeoJSON データを地図上に表示する。

- **geojson** `GeoJSON.FeatureCollection | string` — GeoJSON オブジェクトまたは URL 文字列
- **className** `string` — レイヤー名
- **simpleStyle** `object` — SimpleStyle 形式のスタイル指定（任意）

### `loadData(className, simpleStyle?)`

事前定義されたデータクラスを読み込む。

- **className** `string` — データクラス名
- **simpleStyle** `object` — スタイル指定（任意）

### `removeGeojsonLayer(className)`

GeoJSON レイヤーとソースを削除する。

- **className** `string` — 削除するレイヤー名

---

## OSM POI（OpenStreetMap 地物）

### `loadOsmPoi(osmLayerName, spriteName?)`

OSM の POI レイヤーを表示する。

- **osmLayerName** `OsmLayerNameType` — POI 種別名
- **spriteName** `string` — 使用するスプライトシート名（任意）

### `removeOsmPoi(osmLayerName)`

OSM POI レイヤーを非表示にする。

### 利用可能な OSM POI 種別

| 種別名 | 説明 |
|--------|------|
| `restaurant` | レストラン |
| `cafe` | カフェ |
| `fast-food` | ファストフード |
| `convenience` | コンビニ |
| `bank` | 銀行 |
| `hospital` | 病院 |
| `school` | 学校 |
| `college` | 大学 |
| `railway` | 鉄道駅 |
| `airport` | 空港 |
| `mountain` | 山 |
| `zoo` | 動物園 |
| `parking` | 駐車場 |
| `castle` | 城 |
| `museum` | 博物館 |
| `park` | 公園 |

---

## ハザードマップ

### `loadHazardMapData(layerId)`

防災関連のラスタータイルレイヤーを表示する。

- **layerId** `string` — ハザードマップ ID

### `removeHazardMapData(layerId)`

ハザードマップレイヤーを非表示にする。

利用可能なハザードマップの一覧は `GeoloniaMap.getHazardMapData()` で取得可能。洪水浸水想定、高潮浸水想定、津波浸水想定、土砂災害警戒区域、雪崩危険区域など 12 種類。

---

## 国土数値情報（NLNI）

### `loadNLNIData(layerId)`

国土数値情報のベクタータイルレイヤーを表示する。

- **layerId** `string` — NLNI データ ID

### `removeNLNIData(layerId)`

NLNI レイヤーを非表示にする。

利用可能なデータの一覧は `GeoloniaMap.getNLNIData()` で取得可能。小学校区、中学校区、学校、医療機関、人口推計、駅乗降客数、市区町村役場、盛土地図など 8 種類。

---

## 鳥取県スマートシティデータ

### `loadTottoriData(dataId)`

鳥取県スマートシティデータのタイルレイヤーを表示する。

- **dataId** `string` — データ ID

### `removeTottoriData(dataId)`

鳥取県データレイヤーを非表示にする。

利用可能なデータの一覧は `GeoloniaMap.getTottoriData()` で取得可能。

---

## 背景地図スタイル

### `setBaseMapStyle(styleUrl)`

背景地図のスタイルを切り替える。

- **styleUrl** `string` — スタイル JSON の URL

### 利用可能な背景地図

| キー | 説明 |
|------|------|
| `basic` | Geolonia Basic スタイル |
| `hakuchizu` | 白地図スタイル |
| `hakuchizu-nolabel` | 白地図（ラベルなし） |
| `hakuchizu-notext` | 白地図（テキストなし） |

スタイル URL は `GeoloniaMap.baseMapStyleUrl` プロパティから取得可能。全スタイル一覧は `GeoloniaMap.getBaseMapStyles()` で取得可能。

---

## 3D 地形

### `show3DTerrain()`

3D 地形表示（DEM + 陰影起伏）を有効にする。

### `hide3DTerrain()`

3D 地形を無効にし、2D 表示に戻す。

### `getElevation(lngLat)`

指定座標の標高を取得する。

- **lngLat** `[number, number]` — `[経度, 緯度]`
- **戻り値** `Promise<number>` — 標高（メートル）

---

## レイヤースタイル変更

### `setSymbolIconSize(className, size)`

シンボルレイヤーのアイコンサイズを変更する。

- **className** `string` — レイヤー名
- **size** `number` — アイコンサイズ（デフォルト: 1.0）

### `setCircleStyle(className, style)`

サークルレイヤーのスタイルを変更する。

- **className** `string` — レイヤー名
- **style** `CircleStyleOptions`

```typescript
interface CircleStyleOptions {
  color?: string;       // 塗りつぶし色
  radius?: number;      // 半径（ピクセル）
  strokeColor?: string; // 枠線色
  strokeWidth?: number; // 枠線幅
  opacity?: number;     // 不透明度（0-1）
}
```

### `setFillStyle(className, style)`

ポリゴンレイヤーのスタイルを変更する。

- **className** `string` — レイヤー名
- **style** `FillStyleOptions`

```typescript
interface FillStyleOptions {
  color?: string;        // 塗りつぶし色
  opacity?: number;      // 不透明度（0-1）
  outlineColor?: string; // 輪郭線色
}
```

### `setLineStyle(className, style)`

ラインレイヤーのスタイルを変更する。

- **className** `string` — レイヤー名
- **style** `LineStyleOptions`

```typescript
interface LineStyleOptions {
  color?: string;   // 線色
  width?: number;   // 線幅
  opacity?: number; // 不透明度（0-1）
}
```

---

## フィーチャクエリ

### `hasFeature(xy, layerIds?)`

指定座標にフィーチャが存在するか確認する。

- **xy** `[number, number] | [[number, number], [number, number]]` — ピクセル座標またはバウンディングボックス
- **layerIds** `string[]` — 検索対象レイヤー ID（任意）
- **戻り値** `boolean`

### `getFeatures(xy, options?)`

指定座標のフィーチャオブジェクトを取得する。

- **xy** — 座標指定
- **options** — クエリオプション
- **戻り値** `Feature[]`

### `getFeaturesProperties(xy, options?)`

指定座標のフィーチャプロパティのみを取得する。

---

## マーカー

### `addImageMarker(imageUrl, lat, lon, name?)`

カスタム画像マーカーを追加する。

- **imageUrl** `string` — 画像 URL
- **lat** `number` — 緯度
- **lon** `number` — 経度
- **name** `string` — マーカー名（任意）

### `removeImageMarker(lat, lon, name?)`

画像マーカーを削除する。

### `removeAllImageMarkers()`

全画像マーカーを削除する。

### `setImageMarkerWidth(name, width)`

画像マーカーの表示幅を変更する。

---

## レイヤーアイコン変更

### `changeLayerIcon(layerId, iconName, spriteKey?)`

特定レイヤーのアイコンを変更する。

- **layerId** `string` — レイヤー ID
- **iconName** `string` — 新しいアイコン名
- **spriteKey** `string` — スプライトシートキー（任意）

---

## カスタムレイヤー管理

### `removeAllCustomLayers()`

ユーザーが追加した全カスタムレイヤーを削除する。

---

## 静的メソッド

### `GeoloniaMap.getOsmPoiLayers()`

利用可能な OSM POI 種別の一覧を取得する。

### `GeoloniaMap.getHazardMapData()`

利用可能なハザードマップの一覧を取得する。

### `GeoloniaMap.getNLNIData()`

利用可能な国土数値情報データの一覧を取得する。

### `GeoloniaMap.getBaseMapStyles()`

利用可能な背景地図スタイルの一覧を取得する。

### `GeoloniaMap.getTottoriData()`

鳥取県スマートシティデータの一覧を取得する。

- **戻り値** `Promise<TottoriDataEntry[]>`

### `GeoloniaMap.getIconNames(spriteKey)`

スプライトシートに含まれるアイコン名の一覧を取得する。

- **spriteKey** `string` — スプライトキー
- **戻り値** `Promise<string[]>`

### `GeoloniaMap.getIconStyles(spriteKey)`

スプライトシートの各アイコンの CSS スタイル情報を取得する。

- **spriteKey** `string` — スプライトキー
- **戻り値** `Promise<{width, height, backgroundImage, backgroundPosition}[]>`

### `GeoloniaMap.fetchPrefNames()`

全都道府県名の一覧を取得する。

- **戻り値** `Promise<string[]>`

### `GeoloniaMap.fetchCityNames(prefName)`

指定都道府県の市区町村名一覧を取得する。

- **prefName** `string` — 都道府県名
- **戻り値** `Promise<string[]>`

### `GeoloniaMap.getLatLngByPrefecture(prefName)`

都道府県の中心座標を取得する。

- **prefName** `string` — 都道府県名
- **戻り値** `Promise<[number, number] | null>`

### `GeoloniaMap.getLatLngByCity(prefName, cityName)`

市区町村の中心座標を取得する。

- **prefName** `string` — 都道府県名
- **cityName** `string` — 市区町村名
- **戻り値** `Promise<[number, number] | null>`

---

## 静的プロパティ

### `GeoloniaMap.spriteSheetUrl`

利用可能なスプライトシートの URL マップ。

```javascript
{
  'chizubouken-lab': 'https://geolonia.github.io/chizubouken-lab-sprite/sprite',
  'mapfan':          'https://geolonia.github.io/mapfandb-sprite/sprite',
  'smartmap':        'https://geolonia.github.io/custom-smartmap-sprite/sprite',
  'basic':           'https://geoloniamaps.github.io/basic-v1/basic-v1',
}
```

### `GeoloniaMap.baseMapStyleUrl`

利用可能な背景地図スタイル URL のマップ。

---

## デフォルト定数

| 定数 | 値 | 説明 |
|------|----|------|
| `DEFAULT_CIRCLE_COLOR` | `#FF0000` | サークルのデフォルト色 |
| `DEFAULT_LINE_COLOR` | `#0000FF` | ラインのデフォルト色 |
| `DEFAULT_FILL_COLOR` | `#00FF00` | ポリゴンのデフォルト色 |
| `DEFAULT_FILL_OPACITY` | `0.5` | ポリゴンのデフォルト不透明度 |
| `DEFAULT_LINE_WIDTH` | `2` | ラインのデフォルト幅 |
| `BOLD_LINE_WIDTH` | `4` | 太線幅 |

### マーカーサイズ

| サイズ名 | 値 |
|----------|----|
| `small` | 0.3 |
| `medium` | 0.5 |
| `large` | 1.0 |

### サークルサイズ

| サイズ名 | 半径 (px) |
|----------|-----------|
| `small` | 3 |
| `medium` | 6 |
| `large` | 10 |
