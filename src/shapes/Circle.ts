import {RectangleLike} from "../core/interface.ts";
import Ellipse from "./Ellipse";
import Path2D from '../core/Path2D.ts'

type EllipseConfig = {
    cx: number;//CX属性定义的圆中心的x坐标
    cy: number;
    r: number;
}

class Circle extends Ellipse {
    public r: number;

    constructor({cx, cy, r}: EllipseConfig = {cx: 0, cy: 0, r: 10}) {
        super({cx, cy, rx: r, ry: r,});
        this.r = r;
    }

    getBoundingClientRect(): RectangleLike {
        return {
            x: this.x - this.r,
            y: this.y - this.r,
            width: 2 * this.r,
            height: 2 * this.r
        };
    }

    getShape(): Path2D[] {
        const cx = 0;
        const cy = 0;
        const startAngle = this.startAngle;
        const endAngle = this.endAngle;
        const path = new Path2D();
        path.arc(cx, cy, this.r, startAngle, endAngle);
        path.closePath()
        return [path]
    }
}

export default Circle