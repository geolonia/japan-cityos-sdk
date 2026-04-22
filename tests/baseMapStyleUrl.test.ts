import { baseMapStyleUrl, getBaseMapStyleKeys } from '../src/utils/baseMapStyleUtils';

describe('baseMapStyleUtils', () => {
  describe('baseMapStyleUrl', () => {
    it('hakuchizu スタイルURLが定義されている', () => {
      expect(baseMapStyleUrl['hakuchizu']).toBe('https://geoloniamaps.github.io/hakuchizu-mapstyle/style.json');
    });

    it('hakuchizu-nolabel スタイルURLが定義されている', () => {
      expect(baseMapStyleUrl['hakuchizu-nolabel']).toBe('https://geoloniamaps.github.io/hakuchizu-mapstyle/style-nolabel.json');
    });

    it('hakuchizu-notext スタイルURLが定義されている', () => {
      expect(baseMapStyleUrl['hakuchizu-notext']).toBe('https://geoloniamaps.github.io/hakuchizu-mapstyle/style-notext.json');
    });

    it('basic スタイルURLが定義されている', () => {
      expect(baseMapStyleUrl['basic']).toBe('https://basic-v1-background-only.pages.dev/style.json');
    });
  });

  describe('getBaseMapStyleKeys', () => {
    it('全てのスタイルキーを返す', () => {
      const keys = getBaseMapStyleKeys();
      expect(keys).toContain('basic');
      expect(keys).toContain('hakuchizu');
      expect(keys).toContain('hakuchizu-nolabel');
      expect(keys).toContain('hakuchizu-notext');
    });

    it('配列を返す', () => {
      const keys = getBaseMapStyleKeys();
      expect(Array.isArray(keys)).toBe(true);
      expect(keys.length).toBe(4);
    });
  });
});
