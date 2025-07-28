import { toOsmLayerNameType } from '../src/utils/osmPoiUtils';

describe('toOsmLayerNameType', () => {
  it('英語名を正しく変換できる', () => {
    expect(toOsmLayerNameType('restaurant')).toBe('restaurant');
    expect(toOsmLayerNameType('railway')).toBe('railway');
    expect(toOsmLayerNameType('mountain')).toBe('mountain');
    expect(toOsmLayerNameType('airport')).toBe('airport');
    expect(toOsmLayerNameType('school')).toBe('school');
    expect(toOsmLayerNameType('college')).toBe('college');
    expect(toOsmLayerNameType('convenience')).toBe('convenience');
    expect(toOsmLayerNameType('bank')).toBe('bank');
    expect(toOsmLayerNameType('hospital')).toBe('hospital');
    expect(toOsmLayerNameType('cafe')).toBe('cafe');
    expect(toOsmLayerNameType('fast-food')).toBe('fast-food');
    expect(toOsmLayerNameType('zoo')).toBe('zoo');
    expect(toOsmLayerNameType('parking')).toBe('parking');
    expect(toOsmLayerNameType('castle')).toBe('castle');
    expect(toOsmLayerNameType('museum')).toBe('museum');
  });

  it('日本語名を正しく変換できる', () => {
    expect(toOsmLayerNameType('レストラン')).toBe('restaurant');
    expect(toOsmLayerNameType('鉄道')).toBe('railway');
    expect(toOsmLayerNameType('山')).toBe('mountain');
    expect(toOsmLayerNameType('空港')).toBe('airport');
    expect(toOsmLayerNameType('学校')).toBe('school');
    expect(toOsmLayerNameType('大学')).toBe('college');
    expect(toOsmLayerNameType('コンビニ')).toBe('convenience');
    expect(toOsmLayerNameType('銀行')).toBe('bank');
    expect(toOsmLayerNameType('病院')).toBe('hospital');
    expect(toOsmLayerNameType('カフェ')).toBe('cafe');
    expect(toOsmLayerNameType('ファストフード')).toBe('fast-food');
    expect(toOsmLayerNameType('動物園')).toBe('zoo');
    expect(toOsmLayerNameType('駐車場')).toBe('parking');
    expect(toOsmLayerNameType('城')).toBe('castle');
    expect(toOsmLayerNameType('博物館')).toBe('museum');
  });

  it('未定義の値はundefinedを返す', () => {
    expect(toOsmLayerNameType('unknown')).toBeUndefined();
    expect(toOsmLayerNameType('')).toBeUndefined();
    expect(toOsmLayerNameType('レストランズ')).toBeUndefined();
  });
});