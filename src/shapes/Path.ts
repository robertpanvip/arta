import Shape, {ShapeConfig} from "../core/Shape.ts";
import Context from "../core/Context.ts";
import {CanvasStyle} from "../core/interface.ts";

export interface PathConfig extends ShapeConfig, Partial<CanvasStyle> {
    d: string | Path2D,
}

class Path extends Shape {
    path: Path2D;
    style: Partial<CanvasStyle> = {
        strokeStyle: '#000000'
    }

    constructor({d, ...rest}: PathConfig) {
        super(rest);
        d = new Path2D(d)
        this.path = d;
        this.style = {
            ...rest,
            strokeStyle: '#000000',
        }
    }

    getShape(): Path2D | Path2D[] {
        return this.path
    }

    render(ctx: Context) {

        const path = this.getShape();
        const paths = Array.isArray(path) ? path : [path];

        if (this.style.strokeStyle) {
            paths.forEach(path => {
                ctx.stroke(path)
            })
        }

        if (this.style.fillStyle) {
            paths.forEach(path => {
                ctx.fill(path)
            })
        }

    }
}

export default Path