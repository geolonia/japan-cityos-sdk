import { fetchJson } from '../src/utils/fetchJson';

describe('fetchJson', () => {
  it('正常なURLならJSONを返す', async () => {
    const url = 'https://japanese-addresses-v2.geoloniamaps.com/api/ja.json';
    const json = await fetchJson(url);
    expect(json).toBeDefined();
  });

  it('不正なURLならnullを返す', async () => {
    const url = 'https://example.com/notfound.json';
    const json = await fetchJson(url);
    expect(json).toBeNull();
  });
});
