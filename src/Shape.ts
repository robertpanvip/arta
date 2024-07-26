import Group, {GroupConfig} from "./Group";
import Context from "./Context";

export interface ShapeConfig extends GroupConfig {

}

export default class Shape extends Group {

    constructor(config: Partial<ShapeConfig> = {}) {
        super(config);
    }
    render(context: Context) {
        console.log(context)
    }
}