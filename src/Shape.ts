import {Group} from "./Group";
import Stage from "./Stage";
import {CanvasEvent} from "./EventTarget";
import {bus} from "./Bus";

export default class Shape extends Group {
    #stage: Stage | null = null;

    constructor() {
        super();
        bus.addEventListener('stage::init', (e) => {
            this.#stage = (e as CanvasEvent<Stage>).detail
        })
    }

    render(context: CanvasRenderingContext2D) {
        console.log(context)
    }

    getStage(): null | Stage {
        return this.#stage
    }
}