# アーキテクチャ

## 技術スタック

| 項目 | 技術 |
|------|------|
| 言語 | TypeScript 5.0 |
| 地図エンジン | MapLibre GL JS（`@geolonia/maps-core` 経由） |
| ビルド | Rollup（UMD バンドル） |
| テスト | Jest + ts-jest（jsdom 環境） |
| CSS | SCSS（JS にインライン挿入） |

## ディレクトリ構造

```
japan-cityos-sdk/
├── src/                     # ソースコード
│   ├── index.ts            # エントリポイント（GeoloniaMap クラス）
│   ├── constants.ts        # デフォルト色・サイズ等の定数
│   ├── types.ts            # 型定義（OsmLayerNameType）
│   ├── setFillStyle.ts     # ポリゴンスタイル設定
│   ├── toQueryBox.ts       # 座標→ピクセル変換
│   └── utils/              # ユーティリティモジュール群
│       ├── mapUtils.ts             # コア地図操作（CSV変換, レイヤー管理, APIキー解析）
│       ├── geojsonUtils.ts         # GeoJSON パース・ジオメトリ型検出
│       ├── geometryUtils.ts        # 地理座標計算（距離, 方位角, 最近点）
│       ├── sourceUtils.ts          # GeoJSON ソース管理
│       ├── layerUtils.ts           # レイヤー追加・更新
│       ├── layerConfig.ts          # レイヤー構成テンプレート
│       ├── createLayer.ts          # レイヤーファクトリ関数
│       ├── circleStyleUtils.ts     # サークルスタイル
│       ├── lineStyleUtils.ts       # ラインスタイル
│       ├── baseMapStyleUtils.ts    # 背景地図スタイル URL
│       ├── spriteUtils.ts          # スプライトシート管理
│       ├── osmPoiUtils.ts          # OSM POI レイヤー管理
│       ├── osmStyles.ts            # OSM レイヤースタイル定義
│       ├── hazardmapUtils.ts       # ハザードマップデータ
│       ├── nationalLandNumericalInformationUtils.ts  # 国土数値情報データ
│       ├── tottoriDataUtils.ts     # 鳥取県スマートシティデータ
│       ├── terrainUtils.ts         # 3D 地形・DEM
│       ├── japaneseAdminsUtils.ts  # 行政区域境界 GeoJSON
│       ├── resolveLatLng.ts        # 住所→座標変換
│       └── fetchJson.ts            # HTTP JSON フェッチ
├── tests/                   # テストスイート（41ファイル, 230テスト）
│   ├── __mocks__/          # モックユーティリティ
│   └── *.test.ts           # 各ユーティリティのテスト
├── public/
│   └── index.html          # デモページ（HTML テンプレート）
├── docs/                    # ビルド出力（GitHub Pages 公開）
│   ├── index.js            # UMD バンドル
│   ├── index.js.map        # ソースマップ
│   └── index.html          # デモページ（public/ からコピー）
├── documentation/           # プロジェクトドキュメント
├── rollup.config.mjs       # Rollup ビルド設定
├── tsconfig.json           # TypeScript 設定
├── jest.config.js          # Jest テスト設定
└── package.json            # パッケージ情報
```

## ビルドプロセス

```
npm run build
```

1. `rimraf ./docs` — `docs/` ディレクトリを削除
2. `rollup -c` — 以下を実行:
   - TypeScript コンパイル
   - SCSS を JS にインライン挿入
   - npm パッケージをブラウザ向けにバンドル
   - CommonJS → ESM 変換
   - `process.env.NODE_ENV` を `'production'` に置換
   - JSON インポート処理
   - `public/index.html` と `src/style.json` を `docs/` にコピー
   - UMD 形式で `docs/index.js` を出力（ソースマップ付き）

出力されるバンドルのグローバル名は `City`。

## クラス設計

```
@geolonia/maps-core GeoloniaMap
  └── japan-maps-sdk GeoloniaMap（src/index.ts）
       ├── データ読み込み系メソッド
       │   ├── loadCSV / loadGeojson / loadData
       │   ├── loadOsmPoi / removeOsmPoi
       │   ├── loadHazardMapData / removeHazardMapData
       │   ├── loadNLNIData / removeNLNIData
       │   └── loadTottoriData / removeTottoriData
       ├── スタイル変更系メソッド
       │   ├── setBaseMapStyle
       │   ├── setSymbolIconSize
       │   ├── setCircleStyle / setFillStyle / setLineStyle
       │   └── changeLayerIcon
       ├── 地形・標高系メソッド
       │   ├── show3DTerrain / hide3DTerrain
       │   └── getElevation
       ├── フィーチャクエリ系メソッド
       │   ├── hasFeature
       │   ├── getFeatures
       │   └── getFeaturesProperties
       ├── マーカー系メソッド
       │   ├── addImageMarker / removeImageMarker
       │   ├── removeAllImageMarkers
       │   └── setImageMarkerWidth
       └── 静的メソッド・プロパティ
           ├── getOsmPoiLayers / getHazardMapData / getNLNIData
           ├── getBaseMapStyles / getTottoriData
           ├── getIconNames / getIconStyles
           ├── fetchPrefNames / fetchCityNames
           ├── getLatLngByPrefecture / getLatLngByCity
           ├── spriteSheetUrl
           └── baseMapStyleUrl
```

## テスト

```
npm test
```

Jest + ts-jest で jsdom 環境上でテストを実行する。テストファイルは `tests/` ディレクトリに各ユーティリティモジュールに対応する形で配置されている。

## デプロイ

`docs/` ディレクトリが GitHub Pages で公開される。`npm run build` の出力がそのままデプロイ対象となる。

## 主要な外部依存

| パッケージ | 用途 |
|-----------|------|
| `@geolonia/maps-core` | 地図コアライブラリ（Geolonia 拡張版 MapLibre） |
| `maplibre-gl` | 地図レンダリングエンジン |
| `@geolonia/normalize-japanese-addresses` | 日本語住所の正規化・ジオコーディング |
| `papaparse` | CSV パース |
