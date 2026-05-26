/**
 * 都道府県座標ユーティリティ
 *
 * scratch (chizubouken-lab-scratch) の prefecture-anchor.js および
 * draw-prefecture-line.js から移植。
 */

import { normalize } from '@geolonia/normalize-japanese-addresses';

/** アンカー種別: 中心座標 */
export const PREFECTURE_ANCHOR_CENTER = 'center';

/** アンカー種別: 県庁所在地 */
export const PREFECTURE_ANCHOR_CAPITAL = 'capital';

/** アンカー種別 */
export type PrefectureAnchor = typeof PREFECTURE_ANCHOR_CENTER | typeof PREFECTURE_ANCHOR_CAPITAL;

/**
 * 都道府県名からアンカー座標（中心 or 県庁所在地）を取得する。
 * @param prefName 都道府県名（例: "東京都", "北海道"）
 * @param anchor アンカー種別（"center" または "capital"、デフォルト: "center"）
 * @returns 座標 [lng, lat]、取得できない場合は null
 */
export const getPrefectureAnchor = async (
  prefName: string,
  anchor: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
): Promise<[number, number] | null> => {
  try {
    // @geolonia/normalize-japanese-addresses を使用して都道府県情報を取得
    const result = await normalize(prefName);

    if (!result || !result.pref) {
      console.warn(`都道府県 "${prefName}" が見つかりません`);
      return null;
    }

    // アンカー種別に応じて座標を取得
    if (anchor === PREFECTURE_ANCHOR_CAPITAL) {
      // 県庁所在地の座標を取得
      // 都道府県名 + "県庁所在地" で住所正規化を試みる
      const capitalName = result.pref === '東京都' ? '東京' : result.pref.replace(/[都道府県]$/, '');
      const capitalResult = await normalize(`${result.pref}${capitalName}`);

      if (capitalResult && capitalResult.point && capitalResult.point.lat && capitalResult.point.lng) {
        return [capitalResult.point.lng, capitalResult.point.lat];
      }
    }

    // 中心座標（デフォルト）または県庁所在地が取得できなかった場合
    if (result.point && result.point.lat && result.point.lng) {
      return [result.point.lng, result.point.lat];
    }

    console.warn(`都道府県 "${prefName}" の座標を取得できません`);
    return null;
  } catch (error) {
    console.error(`都道府県座標の取得に失敗: ${prefName}`, error);
    return null;
  }
};

/**
 * 2地点座標から LineString GeoJSON FeatureCollection を生成する。
 * @param from 始点座標 [lng, lat]
 * @param to 終点座標 [lng, lat]
 * @param properties 追加するプロパティ（オプション）
 * @returns LineString GeoJSON FeatureCollection
 */
export const buildPrefectureLineFeature = (
  from: [number, number],
  to: [number, number],
  properties: Record<string, any> = {},
): GeoJSON.FeatureCollection<GeoJSON.LineString> => {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [from, to],
        },
        properties,
      },
    ],
  };
};

/**
 * 安定なレイヤー識別子を生成する。
 * 再実行時に同じレイヤー名が生成されるため、上書き更新が可能。
 * @param prefFrom 始点都道府県名
 * @param pointFrom 始点アンカー種別
 * @param prefTo 終点都道府県名
 * @param pointTo 終点アンカー種別
 * @returns レイヤー識別子（例: "line-東京-center-大阪-capital"）
 */
export const buildPrefectureLineLayerName = (
  prefFrom: string,
  pointFrom: PrefectureAnchor,
  prefTo: string,
  pointTo: PrefectureAnchor,
): string => {
  // 都道府県名を正規化（都道府県を除去）
  const normalizePrefix = (name: string) => {
    return name.replace(/[都道府県]/g, '').toLowerCase();
  };

  const from = normalizePrefix(prefFrom);
  const to = normalizePrefix(prefTo);

  return `line-${from}-${pointFrom}-${to}-${pointTo}`;
};

/**
 * 2つの都道府県間の LineString を生成する（便利関数）。
 * @param prefFrom 始点都道府県名
 * @param anchorFrom 始点アンカー種別（デフォルト: "center"）
 * @param prefTo 終点都道府県名
 * @param anchorTo 終点アンカー種別（デフォルト: "center"）
 * @returns LineString GeoJSON FeatureCollection、座標取得失敗時は null
 */
export const buildPrefectureLine = async (
  prefFrom: string,
  anchorFrom: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
  prefTo: string,
  anchorTo: PrefectureAnchor = PREFECTURE_ANCHOR_CENTER,
): Promise<{
  geojson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  layerName: string;
} | null> => {
  const from = await getPrefectureAnchor(prefFrom, anchorFrom);
  const to = await getPrefectureAnchor(prefTo, anchorTo);

  if (!from || !to) {
    return null;
  }

  const geojson = buildPrefectureLineFeature(from, to, {
    prefFrom,
    anchorFrom,
    prefTo,
    anchorTo,
  });

  const layerName = buildPrefectureLineLayerName(prefFrom, anchorFrom, prefTo, anchorTo);

  return { geojson, layerName };
};
