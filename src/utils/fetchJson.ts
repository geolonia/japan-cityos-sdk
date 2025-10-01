/**
 * 指定URLからJSONデータを取得する
 * @param url JSONデータのURL
 * @returns Promise<any|null> JSONオブジェクトまたはnull
 */
export async function fetchJson(url: string): Promise<any|null> {
  try {
    const res = await fetch(url);
    if (!res.ok) { return null; }
    return await res.json();
  } catch {
    return null;
  }
}
