import { CIRCLE_SIZE_MAP, DEFAULT_CIRCLE_COLOR, DEFAULT_MARKER_NAME, DEFAULT_TEXT_COLOR, MARKER_SIZE_MAP } from "../constants";
import maplibregl, { FilterSpecification } from "maplibre-gl";

// シンボルレイヤーを作成
export function createSymbolLayer(
    className: string,
    simpleStyle: { [key: string]: any },
    options?: { sourceLayer?: string, filter?: maplibregl.FilterSpecification }
): maplibregl.SymbolLayerSpecification {

    simpleStyle = simpleStyle ?? {};
    options = options ?? {};

    const iconSizeKey = simpleStyle['marker-size'];
    const customIconSize = simpleStyle['custom-marker-size'];
    const iconSize = MARKER_SIZE_MAP[iconSizeKey] ?? MARKER_SIZE_MAP.medium;

    return {
        id: className,
        source: className,
        ...(options?.sourceLayer ? { 'source-layer': options.sourceLayer } : {}),
        ...(options?.filter ? { filter: options.filter } : {}),
        type: 'symbol',
        layout: {
            'icon-image': simpleStyle['marker-symbol'] ?? DEFAULT_MARKER_NAME,
            'icon-size': customIconSize ? customIconSize : iconSize,
            'icon-allow-overlap': true,
            "text-overlap": "always",
            "text-allow-overlap": true,
            "icon-overlap": "always",
            ...(simpleStyle['title'] ? {
                'text-field': simpleStyle['title'],
                'text-font': simpleStyle['text-font'] ?? ["Noto Sans Regular"],
                'text-size': simpleStyle['text-size'] ?? 12,
                'text-offset': simpleStyle['text-offset'] ?? [0, 1.5],
                'text-anchor': simpleStyle['text-anchor'] ?? 'top'
            } : {}),
        },
        paint: {
            ...(simpleStyle.paint ?? {}),
            ...(simpleStyle['title'] && {
                'text-color': simpleStyle['text-color'] ?? DEFAULT_TEXT_COLOR,
                'text-halo-color': '#fff',
                'text-halo-width': 2
            })
        },
        filter: [
            'all',
            ...(options?.filter ? [options.filter] : []),
            ['==', '$type', 'Point']
        ] as FilterSpecification
    };
}

// ポイントレイヤーを作成
export function createCircleLayer(
    className: string,
    simpleStyle: { [key: string]: any },
    options?: { sourceLayer?: string, filter?: maplibregl.FilterSpecification }
): maplibregl.CircleLayerSpecification {

    simpleStyle = simpleStyle ?? {};
    options = options ?? {};

    const circleSizeKey = simpleStyle['circle-radius'];
    const circleSize = CIRCLE_SIZE_MAP[circleSizeKey] ?? CIRCLE_SIZE_MAP.medium;

    return {
        id: className,
        source: className,
        ...(options?.sourceLayer ? { 'source-layer': options.sourceLayer } : {}),
        ...(options?.filter ? { filter: options.filter } : {}),
        type: 'circle',
        paint: {
            'circle-radius': circleSize,
            'circle-color': simpleStyle['marker-color'] || DEFAULT_CIRCLE_COLOR,
            ...simpleStyle.paint,
        },
        filter: [
            'all',
            ...(options?.filter ? [options.filter] : []),
            ['==', '$type', 'Point']
        ] as FilterSpecification
    };
}

// ラインレイヤーを作成
export function createLineLayer(
    className: string,
    simpleStyle: { [key: string]: any },
    options?: { sourceLayer?: string, filter?: maplibregl.FilterSpecification }
): maplibregl.LineLayerSpecification {

    simpleStyle = simpleStyle ?? {};
    options = options ?? {};

    return {
        id: `${className}-line`,
        source: className,
        ...(options?.sourceLayer ? { 'source-layer': options.sourceLayer } : {}),
        ...(options?.filter ? { filter: options.filter } : {}),
        type: 'line',
        paint: {
            'line-color': simpleStyle['line-color'] ?? '#0000FF',
            'line-width': simpleStyle['line-width'] ?? 2,
            ...simpleStyle.paint,
        },
        filter: [
            'all',
            ...(options?.filter ? [options.filter] : []),
            ['==', '$type', 'LineString']
        ] as FilterSpecification
    };
}

// ポリゴンレイヤーを作成
export function createFillLayer(
    className: string,
    simpleStyle?: { [key: string]: any },
    options?: { sourceLayer?: string, filter?: maplibregl.FilterSpecification }
): maplibregl.FillLayerSpecification {

    simpleStyle = simpleStyle ?? {};
    options = options ?? {};

    return {
        id: `${className}-polygon`,
        source: className,
        ...(options.sourceLayer ? { 'source-layer': options.sourceLayer } : {}),
        ...(options.filter ? { filter: options.filter } : {}),
        type: 'fill',
        paint: {
            'fill-color': simpleStyle['fill-color'] ?? '#00FF00',
            'fill-opacity': simpleStyle['fill-opacity'] ?? 0.5,
            ...simpleStyle.paint,
        },
        filter: [
            'all',
            ...(options.filter ? [options.filter] : []),
            ['==', '$type', 'Polygon']
        ] as FilterSpecification
    };
}
