# ユーティリティ関数リファレンス

`src/utils/` に含まれるユーティリティモジュールの詳細リファレンス。

---

## 地理座標計算 (`geometryUtils.ts`)

MapLibre GL に依存しない純粋な地理座標計算関数群。`window.geolonia.japan.geometry` としてグローバルに公開される。

### `distanceBetweenPoints(from, to)`

2 点間の距離をメートル単位で計算する（Haversine 公式）。

- **from** `[number, number]` — `[経度, 緯度]`
- **to** `[number, number]` — `[経度, 緯度]`
- **戻り値** `number` — 距離（メートル）

### `bearingBetweenPoints(from, to)`

2 点間の方位角を計算する（球面三角法）。

- **from** `[number, number]` — `[経度, 緯度]`
- **to** `[number, number]` — `[経度, 緯度]`
- **戻り値** `number` — 方位角（0-360 度）

### `nearestPointOnSegment(p, a, b)`

点 P から線分 AB への最近点を求める（余弦緯度補正付き）。

- **p** `[number, number]` — 対象点
- **a** `[number, number]` — 線分の始点
- **b** `[number, number]` — 線分の終点
- **戻り値** `NearestPointOnSegmentResult`

```typescript
interface NearestPointOnSegmentResult {
  point: [number, number]; // 最近点の座標
  distance: number;        // 距離
  t: number;               // 線分上の位置（0-1）
}
```

### `nearestPointOnLine(point, lineCoords)`

点からポリラインへの最近点を求める。

- **point** `[number, number]` — 対象点
- **lineCoords** `[number, number][]` — ポリラインの座標列
- **戻り値** `NearestPointOnLineResult | null`

```typescript
interface NearestPointOnLineResult {
  point: [number, number]; // 最近点の座標
  distance: number;        // 距離
  segmentIndex: number;    // 最近セグメントのインデックス
  t: number;               // セグメント上の位置（0-1）
}
```

### `collectLineFeatures(geojson)`

GeoJSON FeatureCollection から LineString / MultiLineString フィーチャを抽出する。

- **geojson** `GeoJSON.FeatureCollection`
- **戻り値** `LineFeatureEntry[]`

```typescript
interface LineFeatureEntry {
  coordinates: number[][]; // ライン座標列
  feature: GeoJSON.Feature; // 元のフィーチャ
}
```

---

## GeoJSON ユーティリティ (`geojsonUtils.ts`)

### `parseGeojsonInput(geojson)`

入力値を GeoJSON FeatureCollection またはURL文字列としてパースする。

- **geojson** `any` — JSON 文字列、URL 文字列、または GeoJSON オブジェクト
- **戻り値** `string | GeoJSON.FeatureCollection | undefined`

### `getGeometryTypes(geojson)`

GeoJSON からジオメトリ型の一覧を抽出する。

- **geojson** `GeoJSON.FeatureCollection | string`
- **戻り値** `string[]` — `['Point', 'LineString', 'Polygon']` など

---

## CSV ユーティリティ (`mapUtils.ts`)

### `csvToGeoJSON(data)`

CSV データ（オブジェクト配列）を GeoJSON FeatureCollection に変換する。

- **data** `any[]` — CSV パース済みの行データ
- **戻り値** `GeoJSON.FeatureCollection`

緯度・経度カラムは以下の名前を自動検出:
`lat`/`lng`, `latitude`/`longitude`, `緯度`/`経度` など。

---

## ソース管理 (`sourceUtils.ts`)

### `addOrUpdateGeojsonSource(map, className, geojson)`

GeoJSON ソースを追加、または既存ソースのデータを更新する。

- **map** `maplibregl.Map`
- **className** `string` — ソース ID
- **geojson** `GeoJSON.FeatureCollection | string` — データまたは URL

---

## レイヤー管理 (`layerUtils.ts`)

### `addOrUpdateLayers(map, className, geometryTypes, simpleStyle?)`

ジオメトリ型に応じたレイヤーを作成し、追加または更新する。

### `getLayerIdsBySource(layers, sourceId)`

指定ソース ID に属するレイヤー ID の一覧を取得する。

---

## レイヤーファクトリ (`createLayer.ts`)

### `createSymbolLayer(className, simpleStyle, options?)`

シンボルレイヤー（アイコン + テキスト）を作成する。

### `createCircleLayer(className, simpleStyle, options?)`

サークルレイヤーを作成する。

### `createLineLayer(className, simpleStyle, options?)`

ラインレイヤーを作成する。

### `createFillLayer(className, simpleStyle?, options?)`

ポリゴン（塗りつぶし）レイヤーを作成する。

### `createLayersByGeometryTypes(className, geometryTypes, simpleStyle?, options?)`

ジオメトリ型の配列から適切なレイヤー群を一括生成する。

各関数の `options`:

```typescript
{
  sourceLayer?: string;           // ベクタータイルのソースレイヤー名
  filter?: FilterSpecification;   // MapLibre フィルタ式
}
```

---

## スプライト管理 (`spriteUtils.ts`)

### `getSpriteIconNames(spriteSheetUrl)`

スプライトシートに含まれるアイコン名一覧を取得する。

- **spriteSheetUrl** `string` — スプライト JSON の URL
- **戻り値** `Promise<string[]>`

### `getSpriteIconStyles(spriteSheetUrl)`

各アイコンの HTML 表示用 CSS スタイルを取得する。

- **戻り値** `Promise<{width, height, backgroundImage, backgroundPosition}[]>`

### `existsSpriteIcon(spriteSheetUrl, iconName)`

指定アイコンがスプライトシートに存在するか確認する。

- **戻り値** `Promise<boolean>`

---

## 住所・座標変換 (`resolveLatLng.ts`)

### `resolveLatLng(address)`

日本語住所を座標に変換する（`@geolonia/normalize-japanese-addresses` を使用）。

- **address** `string` — 都道府県名、または「都道府県名 市区町村名」
- **戻り値** `Promise<[number, number] | null>` — `[経度, 緯度]`

---

## 行政区域 (`japaneseAdminsUtils.ts`)

### `buildJapaneseAdminsUrl(code)`

行政区域コードから GeoJSON URL を構築する。

### `fetchPrefectureGeojson(prefCode)`

都道府県境界の GeoJSON を取得する（2 桁コード）。

### `fetchMunicipalityGeojson(adminCode)`

市区町村境界の GeoJSON を取得する（5 桁コード）。

---

## API キー解析 (`mapUtils.ts`)

### `parseApiKey(script)`

script 要素の `src` 属性 URL から `api-key` パラメータを抽出する。

- **script** `HTMLScriptElement`
- **戻り値** `string | null`

---

## HTTP ユーティリティ (`fetchJson.ts`)

### `fetchJson(url)`

URL から JSON を取得してパースする。エラー時は `null` を返す。

- **url** `string`
- **戻り値** `Promise<any | null>`
