# Japan Maps SDK

日本向け地図表示 SDK。MapLibre GL JS ベースの `@geolonia/maps-core` を拡張し、GeoJSON / CSV データの表示、OSM POI、ハザードマップ、国土数値情報、3D 地形などの機能を提供する。

**デモ:** [https://geolonia.github.io/japan-cityos-sdk/](https://geolonia.github.io/japan-cityos-sdk/)

**CDN:**
```
https://geolonia.github.io/japan-cityos-sdk/index.js
```

## クイックスタート

```html
<div id="map" style="width: 100%; height: 400px;"></div>
<script src="https://geolonia.github.io/japan-cityos-sdk/index.js?api-key=YOUR-API-KEY"></script>
<script>
const map = new geolonia.japan.Map({
  lngLat: [139.6917, 35.6895],
  zoom: 12,
});
</script>
```

### CSV データの読み込み

```javascript
map.loadCSV(url, 'layer-name', { 'marker-color': '#eba037' });
```

### GeoJSON データの読み込み

```javascript
map.loadGeojson(geojson, 'layer-name', {
  'marker-symbol': 'chizubouken-lab:cafe',
});
```

## ディレクトリ構成

```
japan-cityos-sdk/
│
├── src/                        ソースコード
│   ├── index.ts               エントリポイント（GeoloniaMap クラス定義）
│   ├── constants.ts           デフォルト色・サイズなどの定数
│   ├── types.ts               型定義（OsmLayerNameType）
│   ├── setFillStyle.ts        ポリゴンスタイル設定
│   ├── toQueryBox.ts          座標→ピクセルクエリ変換
│   └── utils/                 ユーティリティモジュール群
│       ├── mapUtils.ts            コア操作（CSV変換, レイヤー管理, APIキー解析）
│       ├── geojsonUtils.ts        GeoJSON パース・ジオメトリ型検出
│       ├── geometryUtils.ts       地理座標計算（距離, 方位角, 最近点）
│       ├── sourceUtils.ts         GeoJSON ソース追加・更新
│       ├── layerUtils.ts          レイヤー追加・更新
│       ├── layerConfig.ts         レイヤー構成テンプレート
│       ├── createLayer.ts         レイヤーファクトリ関数
│       ├── circleStyleUtils.ts    サークルスタイル操作
│       ├── lineStyleUtils.ts      ラインスタイル操作
│       ├── baseMapStyleUtils.ts   背景地図スタイル URL 定義
│       ├── spriteUtils.ts         スプライトシート（アイコン）管理
│       ├── osmPoiUtils.ts         OSM POI レイヤー管理
│       ├── osmStyles.ts           OSM レイヤーのスタイル定義
│       ├── hazardmapUtils.ts      ハザードマップ（12種類）
│       ├── nationalLandNumericalInformationUtils.ts
│       │                          国土数値情報データ（8種類）
│       ├── tottoriDataUtils.ts    鳥取県スマートシティデータ
│       ├── terrainUtils.ts        3D 地形・DEM 表示
│       ├── japaneseAdminsUtils.ts 行政区域境界 GeoJSON 取得
│       ├── resolveLatLng.ts       住所→座標変換
│       └── fetchJson.ts           HTTP JSON フェッチ
│
├── tests/                      テストスイート（41ファイル, 230テスト）
│   ├── __mocks__/             モックユーティリティ
│   └── *.test.ts              各ユーティリティのテスト
│
├── public/
│   └── index.html             デモページ（HTML テンプレート）
│
├── docs/                       ビルド出力（GitHub Pages 公開ディレクトリ）
│   ├── index.js               UMD バンドル
│   ├── index.js.map           ソースマップ
│   └── index.html             デモページ（public/ からコピー）
│
├── documentation/              プロジェクトドキュメント
│   ├── getting-started.md     導入ガイド・基本的な使い方
│   ├── api-reference.md       GeoloniaMap クラスの全 API リファレンス
│   ├── data-sources.md        利用可能なデータソース一覧と使い方
│   ├── architecture.md        アーキテクチャ・ビルド・ディレクトリ構造
│   └── utilities.md           ユーティリティ関数の詳細リファレンス
│
├── rollup.config.mjs          Rollup ビルド設定
├── tsconfig.json              TypeScript 設定
├── jest.config.js             Jest テスト設定
└── package.json               パッケージ情報・npm スクリプト
```

## npm スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run build` | `docs/` にバンドルをビルド |
| `npm test` | Jest テストを実行 |
| `npm start` | `docs/` をローカルサーバーで配信 |

## 主な機能

| 機能 | 説明 | 詳細 |
|------|------|------|
| 地図表示 | MapLibre GL ベースの地図描画 | [getting-started.md](documentation/getting-started.md) |
| CSV / GeoJSON | データ読み込みとスタイル指定 | [api-reference.md](documentation/api-reference.md) |
| OSM POI | 16 種類の OpenStreetMap 地物表示 | [data-sources.md](documentation/data-sources.md) |
| ハザードマップ | 洪水・津波等 12 種類の防災データ | [data-sources.md](documentation/data-sources.md) |
| 国土数値情報 | 学区・医療機関等 8 種類の公共データ | [data-sources.md](documentation/data-sources.md) |
| 3D 地形 | DEM + 陰影起伏による立体表示 | [api-reference.md](documentation/api-reference.md) |
| スタイル変更 | サークル・ライン・ポリゴンの動的スタイリング | [api-reference.md](documentation/api-reference.md) |
| 座標計算 | 距離・方位角・最近点のジオメトリ計算 | [utilities.md](documentation/utilities.md) |
| 住所検索 | 都道府県・市区町村名から中心座標を取得 | [api-reference.md](documentation/api-reference.md) |

## ドキュメント

- **[導入ガイド](documentation/getting-started.md)** — CDN 利用方法、地図の作成、データ読み込みの基本
- **[API リファレンス](documentation/api-reference.md)** — GeoloniaMap クラスの全メソッド・プロパティ
- **[データソース](documentation/data-sources.md)** — OSM POI、ハザードマップ、国土数値情報等の一覧と使い方
- **[アーキテクチャ](documentation/architecture.md)** — 技術スタック、ビルドプロセス、クラス設計
- **[ユーティリティ](documentation/utilities.md)** — 座標計算、GeoJSON パース等の関数リファレンス

## ライセンス

MIT
