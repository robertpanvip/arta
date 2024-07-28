import {ShapeConfig} from "../Shape";

export default class G {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    #_config: ShapeConfig;
    
    constructor(config:ShapeConfig) {
        this.#_config = config;
    }
}
