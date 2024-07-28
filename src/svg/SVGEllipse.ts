import CoreEllipse from "../shapes/Ellipse";
import {EllipseConfig} from "./interface.ts";

export default class SVGEllipse extends CoreEllipse{
    constructor(props:EllipseConfig) {
        super(props);
    }
}