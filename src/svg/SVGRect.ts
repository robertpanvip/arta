import {SVGRectConfig} from "./interface";
import CoreRect, {RectConfig} from '../shapes/Rect'

function toCamelCase(str: string) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

export default class SVGRect extends CoreRect {
    constructor(config: SVGRectConfig) {
        const _config: Partial<RectConfig> = {}
        Object.keys(config).forEach((attrName) => {
            _config[toCamelCase(attrName) as keyof RectConfig] = config[attrName as keyof SVGRectConfig] as never
        })
        super(_config);

    }
}