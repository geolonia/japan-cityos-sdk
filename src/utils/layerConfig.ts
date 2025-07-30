export type GeometryType = 'circle' | 'polygon' | 'line';

export const layerConfigFactory: (
    key: GeometryType, id: string, color?: string, sourceLayerId?: string
) => maplibregl.LayerSpecification[] = (key, id, color, sourceLayerId) => {

    const defaultColor = '#563310';

    const baseConfig: {[key: string]: string} = {
        id: id,
        source: id
    };

    if (sourceLayerId) { baseConfig['source-layer'] = sourceLayerId; }

    return ({
        'circle': [{
            ...baseConfig,
            type: 'circle',
            paint: {
                'circle-radius': 6,
                'circle-color': !color || color === '' ? defaultColor : color,
                'circle-opacity': 0.8,
                'circle-stroke-width': 1,
                'circle-stroke-color': !color || color === '' ? defaultColor : color
            }
        }],
        'polygon':[
            {
            ...baseConfig,
                type: 'fill',
                paint: {
                    'fill-color': !color || color === '' ? defaultColor : color,
                    'fill-opacity': 0.3
                }
            },
            {
                ...baseConfig,
                id: `${id}-outline`,
                type: 'line',
                filter: ['==', ['geometry-type'], 'Polygon'],
                paint: {
                    'line-color': !color || color === '' ? defaultColor : color,
                    'line-width': 2,
                    'line-opacity': 1
                }
            }
        ],
        'line': [{
            ...baseConfig,
            type: 'line',
            paint: {
                'line-color': !color || color === '' ? defaultColor : color,
                'line-width': 3
            }
        }]
    }[key] as maplibregl.LayerSpecification[]);
};
