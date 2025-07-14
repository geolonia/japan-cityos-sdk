import { parseApiKey } from '../src/utils/mapUtils';

describe('parseApiKey', () => {
  const createScriptTag = (src: string) => {
    const script = document.createElement('script');
    script.src = src;
    return script;
  };

  afterEach(() => {
    document.head.innerHTML = ''; // テスト後にscriptタグをクリア
  });

  test('現在のスクリプトタグから api-key をパースできるべき', () => {
    const script = createScriptTag('https://city.geolonia.com/v1/japan/api.js?api-key=12345');
    const apiKey = parseApiKey(script);
    expect(apiKey).toBe('12345');
  });

  test('スクリプトタグに api-key がない場合は null を返すべき', () => {
    const script = createScriptTag('https://city.geolonia.com/v1/japan/api.js');
    const apiKey = parseApiKey(script);
    expect(apiKey).toBeNull();
  });

  test('相対パスのスクリプトソースも正しく処理できるべき', () => {
    const script = createScriptTag('/v1/japan/api.js?api-key=abcde');
    const apiKey = parseApiKey(script);
    expect(apiKey).toBe('abcde');
  });
});
