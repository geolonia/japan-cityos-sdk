import { getJapaneseOsmLayerNames } from '../src/utils/osmPoiUtils';

describe('getJapaneseOsmLayerNames', () => {
  it('日本語POIレイヤー名の配列を返す', () => {
    const names = getJapaneseOsmLayerNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
    // 代表的な日本語名が含まれていること
    expect(names).toContain('レストラン');
    expect(names).toContain('鉄道');
    expect(names).toContain('山');
    expect(names).toContain('空港');
    expect(names).toContain('学校');
    expect(names).toContain('大学');
    expect(names).toContain('コンビニ');
    expect(names).toContain('銀行');
    expect(names).toContain('病院');
    expect(names).toContain('カフェ');
    expect(names).toContain('ファストフード');
    expect(names).toContain('動物園');
    expect(names).toContain('駐車場');
    expect(names).toContain('城');
    expect(names).toContain('博物館');
  });

  it('英語名は含まれていない', () => {
    const names = getJapaneseOsmLayerNames();
    expect(names).not.toContain('restaurant');
    expect(names).not.toContain('railway');
    expect(names).not.toContain('mountain');
    expect(names).not.toContain('airport');
    expect(names).not.toContain('school');
    expect(names).not.toContain('college');
    expect(names).not.toContain('convenience');
    expect(names).not.toContain('bank');
    expect(names).not.toContain('hospital');
    expect(names).not.toContain('cafe');
    expect(names).not.toContain('fast-food');
    expect(names).not.toContain('zoo');
    expect(names).not.toContain('parking');
    expect(names).not.toContain('castle');
    expect(names).not.toContain('museum');
  });
});
