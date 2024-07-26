import Path, {PathConfig} from "./Path";
import {CanvasStyle} from "../interface";

export interface RectConfig extends Omit<PathConfig, 'd'> {
    width: number,
    height: number,
    rx?: number,
    ry?: number,
}

export interface RectStyle extends CanvasStyle {
    width: number,
    height: number,
    rx?: number,
    ry?: number,
}

class Rect extends Path {
    readonly #config: RectConfig;
    style: Partial<RectStyle> = {}

    constructor(props: RectConfig = {
        width: 400,
        height: 200,
    }) {
        super({...props, d: ''});
        this.#config = {...props};
        const {
            rx,
            ry,
            width,
            height
        } = props;
        this.style = {
            ...props,
            strokeStyle: '#000000',
            width,
            height,
            rx,
            ry,
        }
    }

    getPath(): Path2D[] {
        const path = new Path2D();
        const { rx, ry, width, height} = this.#config;
        path.roundRect(0, 0, parseFloat(`${width}`), parseFloat(`${height}`), [rx, ry] as number[])
        path.closePath();
        return [path]
    }
}

export default Rect