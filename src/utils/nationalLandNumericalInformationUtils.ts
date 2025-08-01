import { layerConfigFactory } from "./layerConfig";

const NLNI_DATA: { [key: string]: { tileUrl: string; id: string; geometryType: 'circle' | 'polygon' | 'line'; color: string } } = {
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
    "医療機関": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT010/{z}/{x}/{y}.pbf",
        id: "medical-institution",
        geometryType: 'circle',
        color: '#16a085'
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
    "市町村役場及び集会施設等": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT018/{z}/{x}/{y}.pbf",
        id: "municipal-office-and-community-facility",
        geometryType: 'circle',
        color: '#34495e'
    },
    "大規模盛土造成地": {
        tileUrl: "https://du6jhqfvlioa4.cloudfront.net/ex-api/external/XKT020/{z}/{x}/{y}.pbf",
        id: "large-scale-embankment-map",
        geometryType: 'polygon',
        color: '#e84393'
    }
};


export const addNLNISource = (map: maplibregl.Map, nlniId: string): string | undefined => {
    const hazardMapData = NLNI_DATA[nlniId];
    if (!hazardMapData) {
        console.error(`Hazard map data for ${nlniId} not found.`);
        return undefined;
    }

    const id = hazardMapData.id;
    if (!map.getSource(id)) {
        map.addSource(id, {
            type: 'vector',
            tiles: [hazardMapData.tileUrl],
            attribution: '国土交通省国土数値情報ダウンロードサイト'
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
