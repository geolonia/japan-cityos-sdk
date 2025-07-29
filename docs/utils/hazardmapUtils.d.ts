export declare const addHazardMapSource: (map: maplibregl.Map, hazardMapId: string) => string | undefined;
export declare const addHazardMapLayer: (map: maplibregl.Map, key: string) => void;
export declare const removeHazardMapLayer: (map: maplibregl.Map, key: string) => void;
export declare function getHazardMapKeys(): string[];
