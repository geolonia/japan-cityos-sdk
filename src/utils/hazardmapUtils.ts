const HAZARD_MAP_DATA: { [key: string]: { tileUrl: string; dataType: string } } = {
  '洪水浸水想定区域(想定最大規模)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '洪水浸水想定区域(計画規模(現在の凡例))': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '浸水継続時間(想定最大規模)':{
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '家屋倒壊等氾濫想定区域(氾濫流)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_hanran_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '家屋倒壊等氾濫想定区域(河岸侵食)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_kagan_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '内水(雨水出水)浸水想定区域':{
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/02_naisui_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '高潮浸水想定区域': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '津波浸水想定': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '土砂災害警戒区域(土石流)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '土砂災害警戒区域(急傾斜地の崩壊)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '土砂災害警戒区域(地すべり)': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png",
    "dataType": "raster"
  },
  '雪崩危険箇所': {
    "tileUrl": "https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/{z}/{x}/{y}.png",
    "dataType": "raster"
  }
};
