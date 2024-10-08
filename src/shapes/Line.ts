import {RectangleLike} from "../core/interface.ts";
import Shape from "../core/Shape.ts";
import Context from "../core/Context.ts";
import {Point} from "../core/Util.ts";

type LineConfig = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    stroke?: string | CanvasGradient | CanvasPattern,
    strokeWidth?: number,
    lineCap?: CanvasLineCap;
    lineDashOffset?: number
    lineJoin?: CanvasLineJoin
}

type LineStyle = {
    cursor?: string,
    color?: string | CanvasGradient | CanvasPattern,
    strokeWidth?: number,
    lineCap?: CanvasLineCap,
    lineDashOffset?: number
    lineJoin?: CanvasLineJoin
}

class Line extends Shape {
    name: string = 'Line';
    style: LineStyle = {};
    x2: number = 0;
    y2: number = 0;

    constructor(
        {
            x1, y1, x2, y2, stroke, strokeWidth
        }: LineConfig =
            {
                x1: 0, y1: 0, x2: 100, y2: 100, stroke: 'black', strokeWidth: 1
            }
    ) {
        super();
        this.x = x1;
        this.y = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.style.color = stroke || 'black'
        this.style.strokeWidth = strokeWidth
    }

    render(ctx: Context) {
        const lineWidth = this.style?.strokeWidth || 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = this.style.lineCap! || 'butt';
        const point = new Point(this.x2, this.y2).subtract(new Point(0,0));
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
    }


    getBoundingClientRect(): RectangleLike {
        const point = new Point(this.x2, this.y2).subtract(new Point(0, 0));
        let points = [
            {x: this.x, y: this.y},
            point,
        ]
        const lineCap = this.style.lineCap || "butt"
        if (lineCap === 'square') {
            points = this.getSquarePoints();
        }
        if (lineCap === 'butt') {
            points = this.getButtPoints();
        }
        // 获取x坐标和y坐标的数组
        const xCoordinates = points.map(point => point.x);
        const yCoordinates = points.map(point => point.y);

        // 找到最小和最大的x坐标
        const minX = Math.min(...xCoordinates);
        const maxX = Math.max(...xCoordinates);

        // 找到最小和最大的y坐标
        const minY = Math.min(...yCoordinates);
        const maxY = Math.max(...yCoordinates);

        const width = maxX - minX;
        const height = maxY - minY;

        return {
            x: minX,
            y: minY,
            width,
            height
        };
    }

    getSquarePoints() {
        const point = new Point(this.x2, this.y2).subtract(new Point(0, 0));
        const lineWidth = this.style?.strokeWidth || 1;
        const {x: x1, y: y1} = this;
        const {x: x2, y: y2} = point
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const offsetX1 = Math.sin(angle) * lineWidth / 2;
        const offsetY1 = Math.cos(angle) * lineWidth / 2;
        const halfWidth = lineWidth / 2;
        const perpendicularAngle = angle + Math.PI / 2;
        const offsetX = Math.sin(perpendicularAngle) * halfWidth;
        const offsetY = Math.cos(perpendicularAngle) * halfWidth;
        return [
            {
                x: x1 - offsetX - offsetX1,
                y: y1 + offsetY + offsetY1
            }, {
                x: x2 + offsetX - offsetX1,
                y: y2 - offsetY + offsetY1
            }, {
                x: x2 + offsetX + offsetX1,
                y: y2 - offsetY - offsetY1
            }, {
                x: x1 - offsetX + offsetX1,
                y: y1 + offsetY - offsetY1
            }
        ]
    }

    getButtPoints() {
        const point = new Point(this.x2, this.y2).subtract(new Point(0, 0));
        const lineWidth = this.style?.strokeWidth || 1;
        const {x: x1, y: y1} = this;
        const {x: x2, y: y2} = point
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const offsetX = Math.sin(angle) * lineWidth / 2;
        const offsetY = Math.cos(angle) * lineWidth / 2;
        return [
            {
                x: x1 - offsetX,
                y: y1 + offsetY
            },
            {
                x: x2 - offsetX,
                y: y2 + offsetY
            },
            {
                x: x2 + offsetX,
                y: y2 - offsetY
            },
            {
                x: x1 + offsetX,
                y: y1 - offsetY
            }
        ]
    }

    getShape(): Path2D[] {
        const lineWidth = this.style?.strokeWidth || 1;
        const lineCap = this.style.lineCap || "butt"
        const point = new Point(this.x2, this.y2).subtract(new Point(0, 0));
        const path = new Path2D();
        const {x: x1, y: y1} = this;
        const {x: x2, y: y2} = point
        const angle = Math.atan2(y2 - y1, x2 - x1);
        if (lineCap === 'butt') {
            const points = this.getButtPoints()
            path.moveTo(points[0].x, points[0].y);
            path.lineTo(points[1].x, points[1].y);
            path.lineTo(points[2].x, points[2].y);
            path.lineTo(points[3].x, points[3].y);
            path.closePath();
        } else if (lineCap === 'round') {
            const radius = lineWidth / 2;
            path.arc(x1, y1, radius, angle + Math.PI / 2, angle - Math.PI / 2, false);
            path.arc(x2, y2, radius, angle - Math.PI / 2, angle + Math.PI / 2, false);
            path.closePath();
        } else if (lineCap === 'square') {
            const points = this.getSquarePoints()
            path.moveTo(points[0].x, points[0].y);
            path.lineTo(points[1].x, points[1].y);
            path.lineTo(points[2].x, points[2].y);
            path.lineTo(points[3].x, points[3].y);
            path.closePath();
        }
        return [path];
    }
}

export default Line