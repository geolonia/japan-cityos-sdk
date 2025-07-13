import { AddLayerObject } from "maplibre-gl";
import { OsmLayerNameType } from "../types";
import { OSM_SOURCE_ID } from "./osmPoiUtils";

export const getOSMLayerConfig = (layerName: OsmLayerNameType): AddLayerObject[] => {
    return ({
        'railway': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "minzoom": 12,
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "==",
                    "class",
                    "railway"
                ],
                [
                    "==",
                    "subclass",
                    "station"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "icon-padding": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    30,
                    15,
                    2
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9,
                "icon-optional": false,
                "icon-ignore-placement": false,
                "icon-allow-overlap": false,
                "text-ignore-placement": false,
                "text-allow-overlap": false,
                "text-optional": true
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#415CBD",
                "text-halo-width": 2,
                "text-halo-color": "#ffffff"
            }
        }],
        'mountain': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "mountain_peak",
            "minzoom": 6,
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    "mountain",
                    "circle-stroked"
                ],
                "icon-padding": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    8,
                    50,
                    11,
                    100,
                    20,
                    2
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9,
                "visibility": "visible"
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'airport': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "oc-airport",
            "minzoom": 5,
            "maxzoom": 6,
            "filter": [
                "all",
                [
                    "==",
                    "class",
                    "airport"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-image": "airport",
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.6
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        },
        {
            "id": "poi-airport",
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "aerodrome_label",
            "minzoom": 8,
            "filter": [
                "all",
                [
                    "has",
                    "iata"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-image": "circle-stroked",
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.6
                ],
                "text-size": 12,
                "text-max-width": 9,
                "icon-size": 0.6,
                "visibility": "visible"
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        },
        {
            "id": "poi-airport-primary",
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "aerodrome_label",
            "minzoom": 8,
            "filter": [
                "all",
                [
                    "has",
                    "iata"
                ],
                [
                    "!=",
                    "class",
                    "military"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-image": "airport",
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.6
                ],
                "text-size": 12,
                "text-max-width": 9,
                "icon-size": 1,
                "visibility": "visible"
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'convenience': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "convenience"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'restaurant': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "restaurant"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'bank': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "bank"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'hospital': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "hospital"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'college': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "college"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'fast-food': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "fast_food"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'school': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "school"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'cafe': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "cafe"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'zoo': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "zoo"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'parking': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "parking"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'museum': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "museum"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'castle': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": OSM_SOURCE_ID,
            "source-layer": "poi",
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Universal Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "get",
                        "class"
                    ],
                    "circle-stroked"
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "==",
                    "class",
                    "castle"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#333",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }],
        'park': [{
            "id": `osm-${layerName}`,
            "type": "symbol",
            "source": "geolonia-gsi-custom",
            "source-layer": "poi",
            "minzoom": 16,
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "!has",
                    "wikidata"
                ],
                [
                    "in",
                    "class",
                    "park"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "image",
                        [
                            "get",
                            "class"
                        ]
                    ],
                    [
                        "image",
                        "circle-stroked"
                    ]
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        },
        {
            "id": `osm-${layerName}2`,
            "type": "symbol",
            "source": "geolonia-gsi-custom",
            "source-layer": "poi",
            "minzoom": 13,
            "filter": [
                "all",
                [
                    "==",
                    "$type",
                    "Point"
                ],
                [
                    "has",
                    "name"
                ],
                [
                    "has",
                    "wikidata"
                ],
                [
                    "in",
                    "class",
                    "park"
                ],
                [
                    "!=",
                    "disputed",
                    "japan_northern_territories"
                ]
            ],
            "layout": {
                "text-padding": 2,
                "text-font": [
                    "Noto Sans Regular"
                ],
                "text-anchor": "top",
                "icon-anchor": "bottom",
                "icon-image": [
                    "coalesce",
                    [
                        "image",
                        [
                            "get",
                            "class"
                        ]
                    ],
                    [
                        "image",
                        "circle-stroked"
                    ]
                ],
                "icon-padding": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    11,
                    15,
                    15,
                    2
                ],
                "text-field": "{name}",
                "text-offset": [
                    0,
                    0.3
                ],
                "text-size": 12,
                "text-max-width": 9
            },
            "paint": {
                "text-halo-blur": 0.5,
                "text-color": "#666",
                "text-halo-width": 1,
                "text-halo-color": "#ffffff"
            }
        }]
    }[layerName] || []) as AddLayerObject[];
};