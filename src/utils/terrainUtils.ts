import maplibregl from 'maplibre-gl';

export const TERRAIN_SOURCE_ID = "dem";
export const HILLSHADE_LAYER_ID = "hillshading";

/**
 * DEMソースを追加する
 */
export function addTerrainSource(map: maplibregl.Map, apiKey: string) {
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: "raster-dem",
      url: `https://tileserver.geolonia.com/gsi-dem/tiles.json?key=${apiKey}`
    });
  }
}

/**
 * hillshadeレイヤーを追加する
 */
export function addHillshadeLayer(map: maplibregl.Map) {
  if (!map.getLayer(HILLSHADE_LAYER_ID)) {
    map.addLayer({
      id: HILLSHADE_LAYER_ID,
      type: "hillshade",
      source: TERRAIN_SOURCE_ID,
      paint: {
        "hillshade-exaggeration": 0.5,
        "hillshade-shadow-color": "rgba(71, 59, 36, 0.1)"
      }
    });
  }
}
