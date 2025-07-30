export type GeometryType = 'circle' | 'polygon' | 'line';
export declare const layerConfigFactory: (key: GeometryType, id: string, color?: string, sourceLayerId?: string) => maplibregl.LayerSpecification[];
