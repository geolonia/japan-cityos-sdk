const HAZARD_MAP_DATA: { [key: string]: { tileUrl: string; id: string } } = {
  '洪水浸水想定区域(想定最大規模)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png",
    "id": "flood-inundation-assumed-area-maximum-assumed-scale"
  },
  '洪水浸水想定区域(計画規模(現在の凡例))': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_data/{z}/{x}/{y}.png",
    "id": "flood-inundation-assumed-area-planned-scale-current-legend"
  },
  '浸水継続時間(想定最大規模)':{
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_data/{z}/{x}/{y}.png",
    "id": "flood-inundation-continuation-time-maximum-assumed-scale"
  },
  '家屋倒壊等氾濫想定区域(氾濫流)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_hanran_data/{z}/{x}/{y}.png",
    "id": "house-collapse-flood-assumed-area-flood-flow"
  },
  '家屋倒壊等氾濫想定区域(河岸侵食)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_kagan_data/{z}/{x}/{y}.png",
    "id": "house-collapse-flood-assumed-area-bank-erosion"
  },
  '内水(雨水出水)浸水想定区域':{
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/02_naisui_data/{z}/{x}/{y}.png",
    "id": "internal-water-rainwater-drainage-inundation-assumed-area"
  },
  '高潮浸水想定区域': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png",
    "id": "storm-surge-inundation-assumed-area"
  },
  '津波浸水想定': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png",
    "id": "tsunami-inundation-assumed-area"
  },
  '土砂災害警戒区域(土石流)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png",
    "id": "sediment-disaster-warning-area-debris-flow"
  },
  '土砂災害警戒区域(急傾斜地の崩壊)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png",
    "id": "sediment-disaster-warning-area-steep-slope-collapse"
  },
  '土砂災害警戒区域(地すべり)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png",
    "id": "sediment-disaster-warning-area-landslide"
  },
  '雪崩危険箇所': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/{z}/{x}/{y}.png",
    "id": "avalanche-hazard-location"
  }
};


export const addHazardMapSource = (map: maplibregl.Map, hazardMapId: string): string | undefined => {
  const hazardMapData = HAZARD_MAP_DATA[hazardMapId];
  if (!hazardMapData) {
    console.error(`Hazard map data for ${hazardMapId} not found.`);
    return undefined;
  }

  const id = hazardMapData.id;
  if (!map.getSource(id)) {
    map.addSource(id, {
      type: 'raster',
      tiles: [hazardMapData.tileUrl],
      tileSize: 256,
      attribution: 'ハザードマップポータルサイト'
    });

    return id;
  }
}

export const addHazardMapLayer = (map: maplibregl.Map, key: string) => {
  if (!key) { return; }
  const id = HAZARD_MAP_DATA[key].id;
  if (!map.getLayer(id)) {
    map.addLayer({
      id: id,
      type: 'raster',
      source: id,
      paint: {
        'raster-opacity': 0.5
      }
    });
  }
}

export const removeHazardMapLayer = (map: maplibregl.Map, key: string) => {
  if (!key) { return; }
  const id = HAZARD_MAP_DATA[key].id;
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
}

export function getHazardMapKeys(): string[] {
  return Object.keys(HAZARD_MAP_DATA);
}
