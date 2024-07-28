import CoreGroup from "../Group";
import {SVG} from "./interface";

export default class SVGG extends CoreGroup {
    constructor(config: SVG.Shape) {
        super({x: 0, y: 0, id: config.id});
    }
}
