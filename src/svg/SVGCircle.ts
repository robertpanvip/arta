import CoreCircle from "../shapes/Circle";
import {CircleConfig} from "./interface.ts";

export default class SVGCircle extends CoreCircle{
    constructor(props:CircleConfig) {
        super(props);
    }
}