import { layerConfigFactory } from "./layerConfig";

const NLNI_DATA: { [key: string]: { tileUrl: string; id: string, geometryType: 'circle' | 'polygon' | 'line', color: string } } = {
    "小学校区": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT004/{z}/{x}/{y}.pbf",
        id: "elementary-school-district",
        geometryType: 'polygon',
        color: '#ff0000'
    },
    "中学校区": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT005/{z}/{x}/{y}.pbf",
        id: "junior-high-school-district",
        geometryType: 'polygon',
        color: '#54b738'
    },
    "学校": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT006/{z}/{x}/{y}.pbf",
        id: "school",
        geometryType: 'circle',
        color: '#fccd3f'
    },
    "保育園・幼稚園等": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT007/{z}/{x}/{y}.pbf",
        id: "nursery-kindergarten-etc",
        geometryType: 'circle',
        color: '#e67e22'
    },
    "医療機関": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT010/{z}/{x}/{y}.pbf",
        id: "medical-institution",
        geometryType: 'circle',
        color: '#16a085'
    },
    "福祉施設": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT011/{z}/{x}/{y}.pbf",
        id: "welfare-facility",
        geometryType: 'circle',
        color: '#9b59b6'
    },
    "将来推計人口250mメッシュ": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT013/{z}/{x}/{y}.pbf",
        id: "future-population-estimate-250m-mesh",
        geometryType: 'polygon',
        color: '#f39c12'
    },
    "駅別乗降客数": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT015/{z}/{x}/{y}.pbf",
        id: "station-passenger-numbers",
        geometryType: 'polygon',
        color: '#2980b9'
    },
    "災害危険区域": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT016/{z}/{x}/{y}.pbf",
        id: "disaster-hazard-area",
        geometryType: 'polygon',
        color: '#c0392b'
    },
    "図書館": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT017/{z}/{x}/{y}.pbf",
        id: "library",
        geometryType: 'circle',
        color: '#27ae60'
    },
    "市区町村役場及び集会施設等": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT018/{z}/{x}/{y}.pbf",
        id: "municipal-office-and-community-facility",
        geometryType: 'circle',
        color: '#34495e'
    },
    "自然公園地域": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT019/{z}/{x}/{y}.pbf",
        id: "natural-park-area",
        geometryType: 'circle',
        color: '#2ecc71'
    },
    "大規模盛土造成地マップ": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT020/{z}/{x}/{y}.pbf",
        id: "large-scale-embankment-map",
        geometryType: 'polygon',
        color: '#e84393'
    },
    "地すべり防止地区": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT021/{z}/{x}/{y}.pbf",
        id: "landslide-prevention-area",
        geometryType: 'polygon',
        color: '#fdcb6e'
    },
    "急傾斜地崩壊危険区域": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT022/{z}/{x}/{y}.pbf",
        id: "steep-slope-collapse-hazard-area",
        geometryType: 'polygon',
        color: '#636e72'
    },
    "地形区分に基づく液状化の発生傾向図": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT025/{z}/{x}/{y}.pbf",
        id: "liquefaction-tendency-map-by-landform",
        geometryType: 'polygon',
        color: '#00b894'
    }
};


export const addNLNISource = (map: maplibregl.Map, nlniId: string): string | undefined => {
    const hazardMapData = NLNI_DATA[nlniId];
    if (!hazardMapData) {
        console.error(`Hazard map data for ${nlniId} not found.`);
        return undefined;
    }

    const id = hazardMapData.id;
    console.log(`Adding hazard map source: ${id}`, map.getSource(id));
    if (!map.getSource(id)) {
        map.addSource(id, {
            type: 'vector',
            tiles: [hazardMapData.tileUrl]
        });

        return id;
    }
}

export const addNLNILayer = (map: maplibregl.Map, key: string) => {
    if (!key) { return; }
    const data = NLNI_DATA[key];
    layerConfigFactory(data.geometryType, data.id, data.color, 'hits').forEach(layer => {
        if (data && !map.getLayer(layer.id)) {
            map.addLayer(layer);
        }
    });
}

export const removeNLNILayer = (map: maplibregl.Map, key: string) => {
    if (!key) { return; }
    const data = NLNI_DATA[key];
    layerConfigFactory(data.geometryType, data.id, data.color, 'hits').forEach(layer => {
        if (data && map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
        }
    });
}

export function getNLNIKeys(): string[] {
    return Object.keys(NLNI_DATA);
}
