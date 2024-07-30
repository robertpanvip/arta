import Group, {GroupConfig} from "./Group.ts";
import Context from "./Context.ts";

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