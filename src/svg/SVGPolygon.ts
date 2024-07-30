import CorePolygon from "../shapes/Polygon";
import {PolygonConfig} from "./interface";
import {PointLike} from "../core/interface.ts";

function convertToPoints(...coordinates: number[]): PointLike[] {
    if (coordinates.length % 2 !== 0) {
        throw new Error('The number of coordinates must be even.');
    }

    const points: PointLike[] = [];
    for (let i = 0; i < coordinates.length; i += 2) {
        points.push({x: coordinates[i], y: coordinates[i + 1]});
    }

    return points;
}

export default class SVGPolygon extends CorePolygon {
    constructor(props: PolygonConfig) {
        super({
            ...props,
            points: convertToPoints(...props.points.split(',').map(Number))
        });
    }
}