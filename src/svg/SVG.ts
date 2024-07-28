import CoreGroup from "../Group";
import {SVG as SVGType} from "./interface";

export default class SVG extends CoreGroup {
    constructor(config: SVGType.Shape) {
        super({x: 0, y: 0, id: config.id});
    }

    render(){

    }
}
