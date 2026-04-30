const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const DEFAULT_LIMIT = 10;
const USER_AGENT = "japan-cityos-sdk/1.0 (https://github.com/geolonia/japan-cityos-sdk)";

export type SearchResult = {
  id: string;
  name: string;
  address: string;
  lng: number;
  lat: number;
  source: "nominatim";
};

type NominatimItem = {
  place_id: string;
  display_name: string;
  name?: string;
  lon: string;
  lat: string;
};

function toSearchResult(item: NominatimItem): SearchResult {
  const parts = item.display_name.split(", ");
  const name = item.name || parts[0];
  const address = parts.slice(1).join(", ");
  return {
    id: String(item.place_id),
    name,
    address,
    lng: parseFloat(item.lon),
    lat: parseFloat(item.lat),
    source: "nominatim",
  };
}

export async function searchPlaces(
  query: string,
  options: { limit?: number; signal?: AbortSignal } = {},
): Promise<SearchResult[]> {
  const { limit = DEFAULT_LIMIT, signal } = options;

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: String(limit),
    addressdetails: "1",
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: { "User-Agent": USER_AGENT },
    signal,
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  const items: NominatimItem[] = await res.json();
  return items.map(toSearchResult);
}
