import {SVGTextConfig} from "./interface";
import CoreText from '../shapes/Text'

export default class SVGText extends CoreText{
    constructor(config: SVGTextConfig) {
        super(config);

    }
}