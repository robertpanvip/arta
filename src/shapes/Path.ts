import Shape, {ShapeConfig} from "../Shape";
import Context, {ContextAttrs} from "../Context";
import {CanvasStyle} from "../interface";

export interface PathConfig extends ShapeConfig, Partial<CanvasStyle> {
    d: string | Path2D,
}

class Path extends Shape {
    readonly path: Path2D;
    style: Partial<CanvasStyle> = {
        strokeStyle: '#000000'
    }


    constructor({d, ...rest}: PathConfig) {
        super(rest);
        d = new Path2D(d)
        this.path = d;
        this.style = {
            ...rest,
            strokeStyle: '#000000'
        }
    }

    getPath(): Path2D | Path2D[] {
        return this.path
    }

    render(ctx: Context) {

        const path = this.getPath();
        const paths = Array.isArray(path) ? path : [path];
        ContextAttrs.forEach(attr => {
            if (this.style[attr]) {
                ctx[attr] = this.style[attr] as keyof typeof ctx[typeof attr];
            }
        });

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