import {SVGLineConfig} from "./interface.ts";
import CoreLine from '../shapes/Line'
export default class SVGLine extends CoreLine {
    constructor(config: SVGLineConfig) {
        super(config);
    }
}