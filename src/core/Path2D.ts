import {Measure} from "./Util.ts";
import {SVGPathData} from 'svg-pathdata'
import {Segment} from "./Segment.ts";

const measureSize = Measure.measureSize

const pi = Math.PI;
const tau = 2 * pi;
const epsilon = 1e-6; // 一个非常小的数值，用于浮点数比较
const tauEpsilon = tau - epsilon; // 2π 减去一个非常小的数值，用于处理浮点数精度问题

/**
 * Path 类用于创建和管理 SVG 路径数据字符串。
 */
class CanvasPath extends window.Path2D {
    public _x0: number; // 当前子路径的起点X坐标
    public _y0: number; // 当前子路径的起点Y坐标
    public _x1: number; // 当前子路径的终点X坐标
    public _y1: number; // 当前子路径的终点Y坐标
    public _: string; // 路径数据字符串
    public cache: Segment | null = null

    /**
     * 用于向字符串缓冲区追加四舍五入到指定位数的插值值。
     */
    public _append(strings: TemplateStringsArray, ...values: (string | number)[]) {
        const k = 10 ** 3; // 计算用于四舍五入的系数
        this._ += strings[0];
        for (let i = 1, n = strings.length; i < n; ++i) {
            this._ += Math.round((values[i - 1] as number) * k) / k + strings[i]; // 四舍五入并追加插值值
        }
    }// 字符串追加函数

    addPath(path: Path2D, transform?: DOMMatrix2DInit): void {
        super.addPath(path, transform);
    }

    constructor(path?: CanvasPath) {
        super(path?.toString());
        if (path) {
            this._ = path._;
            this._x0 = path._x0;
            this._y0 = path._y0;
            this._x1 = path._x1;
            this._y1 = path._y1;
        } else {
            this._x0 = this._y0 = this._x1 = this._y1 = 0; // 初始化坐标为 null
            this._ = ""; // 初始化路径数据字符串为空
        }
    }

    /**
     * 移动画笔到指定的 (x, y) 位置，开启一个新的子路径。
     * @param x X 坐标
     * @param y Y 坐标
     */
    moveTo(x: number, y: number): void {
        this._append`M${(this._x0 = this._x1 = +x)},${(this._y0 = this._y1 = +y)}`;
        super.moveTo(x, y)
    }

    /**
     * 闭合当前子路径，如果当前子路径存在。
     */
    closePath(): void {
        if (this._x1 !== null) {
            this._x1 = this._x0;
            this._y1 = this._y0;
            this._append`Z`;
        }
        super.closePath()
    }

    /**
     * 从当前点绘制一条直线到指定的 (x, y) 位置。
     * @param x X 坐标
     * @param y Y 坐标
     */
    lineTo(x: number, y: number): void {
        this._append`L${(this._x1 = +x)},${(this._y1 = +y)}`;
        super.lineTo(x, y)
    }

    /**
     * 绘制二次贝塞尔曲线，从当前点到指定的 (x, y) 位置，控制点为 (x1, y1)。
     * @param x1 控制点X坐标
     * @param y1 控制点Y坐标
     * @param x 终点X坐标
     * @param y 终点Y坐标
     */
    quadraticCurveTo(x1: number, y1: number, x: number, y: number): void {
        this._append`Q${+x1},${+y1},${(this._x1 = +x)},${(this._y1 = +y)}`;
        super.quadraticCurveTo(x1, y1, x, y)
    }

    /**
     * 绘制三次贝塞尔曲线，从当前点到指定的 (x, y) 位置，控制点为 (x1, y1) 和 (x2, y2)。
     * @param x1 第一个控制点X坐标
     * @param y1 第一个控制点Y坐标
     * @param x2 第二个控制点X坐标
     * @param y2 第二个控制点Y坐标
     * @param x 终点X坐标
     * @param y 终点Y坐标
     */
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void {
        this._append`C${+x1},${+y1},${+x2},${+y2},${(this._x1 = +x)},${(this._y1 = +y)}`;
        super.bezierCurveTo(x1, y1, x2, y2, x, y)
    }

    /**
     * 绘制圆弧，从当前点 (x1, y1) 到指定的 (x2, y2)，并且半径为 r。
     * 根据指定的圆弧半径和切线计算新路径。
     * @param x1 圆弧的起点X坐标
     * @param y1 圆弧的起点Y坐标
     * @param x2 圆弧的终点X坐标
     * @param y2 圆弧的终点Y坐标
     * @param r 圆弧的半径
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
        x1 = +x1;
        y1 = +y1;
        x2 = +x2;
        y2 = +y2;
        r = +r;

        if (r < 0) throw new Error(`negative radius: ${r}`); // 半径不能为负数

        const x0 = this._x1;
        const y0 = this._y1;
        const x21 = x2 - x1;
        const y21 = y2 - y1;
        const x01 = x0! - x1;
        const y01 = y0! - y1;
        const l01_2 = x01 * x01 + y01 * y01;

        if (this._x1 === null) {
            // 如果当前路径为空，移动到 (x1, y1)
            this._append`M${(this._x1 = x1)},${(this._y1 = y1)}`;
        } else if (!(l01_2 > epsilon)) {
            // 如果 (x1, y1) 与当前点重合，什么都不做
        } else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
            // 如果 (x0, y0), (x1, y1), (x2, y2) 三点共线，或者半径为 0，绘制一条直线到 (x1, y1)
            this._append`L${(this._x1 = x1)},${(this._y1 = y1)}`;
        } else {
            // 否则绘制圆弧
            const x20 = x2 - x0!;
            const y20 = y2 - y0!;
            const l21_2 = x21 * x21 + y21 * y21;
            const l20_2 = x20 * x20 + y20 * y20;
            const l21 = Math.sqrt(l21_2);
            const l01 = Math.sqrt(l01_2);
            const l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2);
            const t01 = l / l01;
            const t21 = l / l21;

            if (Math.abs(t01 - 1) > epsilon) {
                this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`; // 如果起始切线与 (x0, y0) 不重合，绘制一条短直线
            }

            // 绘制圆弧段
            this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${(this._x1 = x1 + t21 * x21)},${(this._y1 = y1 + t21 * y21)}`;
        }
        super.arcTo(x1, y1, x2, y2, r)
    }

    /**
     * 绘制圆弧，从指定的起点 (x, y) 绘制半径为 r，角度从 a0 到 a1 的圆弧，方向由 ccw 控制。
     * @param x 圆弧的中心X坐标
     * @param y 圆弧的中心Y坐标
     * @param r 圆弧的半径
     * @param a0 起始角度（以弧度表示）
     * @param a1 结束角度（以弧度表示）
     * @param ccw 是否逆时针绘制圆弧，默认值为 false（顺时针）
     */
    arc(x: number, y: number, r: number, a0: number, a1: number, ccw: boolean = false): void {
        x = +x;
        y = +y;
        r = +r;

        if (r < 0) throw new Error(`negative radius: ${r}`); // 半径不能为负数

        const dx = r * Math.cos(a0);
        const dy = r * Math.sin(a0);
        const x0 = x + dx;
        const y0 = y + dy;
        const cw = 1 ^ +ccw;
        let da = ccw ? a0 - a1 : a1 - a0;

        if (this._x1 === null) {
            // 如果当前路径为空，移动到圆弧的起点
            this._append`M${x0},${y0}`;
        } else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1! - y0) > epsilon) {
            // 如果当前点与圆弧的起点不重合，绘制一条直线到起点
            this._append`M${x0},${y0}`;
        }

        if (!r) return; // 如果半径为 0，不绘制任何内容

        if (da < 0) da = da % tau + tau; // 处理角度范围

        if (da > tauEpsilon) {
            // 如果角度差接近 2π，绘制完整的圆
            this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${(this._x1 = x0)},${(this._y1 = y0)}`;
        } else if (da > epsilon) {
            // 否则绘制圆弧段
            this._append`A${r},${r},0,${+(da >= pi)},${cw},${(this._x1 = x + r * Math.cos(a1))},${(this._y1 = y + r * Math.sin(a1))}`;
        }
        super.arc(x, y, r, a0, a1, ccw)
    }

    /**
     * 绘制矩形，位置为 (x, y)，宽度为 w，高度为 h。
     * @param x 矩形的起点X坐标
     * @param y 矩形的起点Y坐标
     * @param w 矩形的宽度
     * @param h 矩形的高度
     */
    rect(x: number, y: number, w: number, h: number): void {
        this._append`M${(this._x0 = this._x1 = +x)},${(this._y0 = this._y1 = +y)}h${(w = +w)}v${+h}h${-w}Z`;
        super.rect(x, y, w, h);
    }


    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        const startX = x + radiusX;
        const startY = y;
        // 上半部分弧段
        const largeArcFlag1 = 0;
        const sweepFlag1 = 1;
        const endX1 = x - radiusX;
        const endY1 = y;

        // 下半部分弧段
        const largeArcFlag2 = 0;
        const sweepFlag2 = 1;
        const endX2 = x + radiusX;
        // 记录路径
        this._append`M ${startX} ${startY} A ${radiusX} ${radiusY} ${rotation} ${largeArcFlag1} ${sweepFlag1} ${endX1} ${endY1} A ${radiusX} ${radiusY} ${rotation} ${largeArcFlag2} ${sweepFlag2} ${endX2} ${y} Z`;
        super.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
    }

    roundRect(x: number, y: number, w: number, h: number, radius?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>) {
        //return super.roundRect(x, y, w, h, radius);
        let _radius = {
            topLeft: 0,
            topRight: 0,
            bottomRight: 0,
            bottomLeft: 0
        }
        if (typeof radius === 'number') {
            _radius = {
                topLeft: radius,
                topRight: radius,
                bottomRight: radius,
                bottomLeft: radius
            }
        } else if (Array.isArray(radius) || (radius as Iterable<number | DOMPointInit>)[Symbol.iterator]) {
            let arr: number[] = []
            if (Array.isArray(radius)) {
                arr = radius.map(item => {
                    return typeof item == 'object' ? (item as DOMPointInit).x! : item
                })
            } else {
                const iterator = (radius as Iterable<number | DOMPointInit>)[Symbol.iterator];
                let current = iterator().next()
                while (current) {
                    arr.push(typeof current == 'object' ? (current as DOMPointInit).x! : current);
                    current = iterator().next()
                }
            }
            if (arr.length === 2) {
                arr = [...arr, ...arr]
            }

            // 如果不满足 4 个值，使用默认半径
            _radius = {
                topLeft: arr[0] || 0,
                topRight: arr[1] || 0,
                bottomRight: arr[2] || 0,
                bottomLeft: arr[3] || 0
            }
        } else if (typeof radius === 'object') {
            const r = radius as DOMPointInit
            _radius = {
                topLeft: r.w!,
                topRight: r.x!,
                bottomRight: r.y!,
                bottomLeft: r.z!
            }
        }

        const {
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        } = _radius

        // 确保半径不超过宽度和高度的一半
        const tl = Math.min(topLeft, w / 2, h / 2);
        const tr = Math.min(topRight, w / 2, h / 2);
        const br = Math.min(bottomRight, w / 2, h / 2);
        const bl = Math.min(bottomLeft, w / 2, h / 2);
        // 开始绘制
        this.moveTo(x + tl, y);
        this.arcTo(x + w, y, x + w, y + h, tr); // 右上角
        this.arcTo(x + w, y + h, x, y + h, br); // 右下角
        this.arcTo(x, y + h, x, y, bl);         // 左下角
        this.arcTo(x, y, x + w, y, tl);         // 左上角
        this.closePath();
    }

    toString(): string {
        return this._;
    }

    getLength() {
        const d = this.toString()
        if (this.cache?._data === d) {
            return this.cache.getLength()
        }
        const seg = new Segment({
            data: d
        })
        this.cache = seg;
        return seg.getLength()
    }

    getPointAtLength(length: number) {
        const d = this.toString()
        if (this.cache?._data === d) {
            return this.cache.getPointAtLength(length)
        }
        const seg = new Segment({
            data: d
        })
        this.cache = seg;
        return seg.getPointAtLength(length)
    }
}

function getCanvasPath(path?: CanvasPath | string, transform?: DOMMatrix2DInit) {
    if (!path) {
        return undefined
    }

    let res: CanvasPath;
    if (typeof path === "string") {
        res = new CanvasPath();
        const {a = 0, b = 0, c = 0, d = 0, e = 0, f = 0} = transform || new DOMMatrix();
        res._ = new SVGPathData(path).matrix(a, b, c, d, e, f).encode();
    } else {
        res = path;
        const {a = 0, b = 0, c = 0, d = 0, e = 0, f = 0} = transform || new DOMMatrix();
        res._ = new SVGPathData(path._).matrix(a, b, c, d, e, f).encode();
    }
    return res;
}

export default class Path2D extends CanvasPath {
    public paths: CanvasPath[] = []

    constructor(path?: Path2D | string) {
        const _path = getCanvasPath(path)
        super(_path);
        this.paths.push(this)
    }

    addPath(path: Path2D, transform?: DOMMatrix2DInit): void {
        super.addPath(path, transform);
        const _path = getCanvasPath(path, transform)
        if (_path) {
            this.paths.push(_path)
        }
    }

    toString(): string {
        return this.paths.map(path => path._).join('')
    }
}

function isEqual(current: DOMMatrix, prev: DOMMatrix) {
    return current.a === prev.a
        && current.b === prev.b
        && current.c === prev.c
        && current.d === prev.d
        && current.e === prev.e
        && current.f === prev.f
}

export class PathContext {
    private store: DOMMatrix[] = [];
    matrix: DOMMatrix = new DOMMatrix();
    prev: DOMMatrix = new DOMMatrix();
    paths: Path2D[] = [];
    current: Path2D

    constructor(path?: Path2D) {
        this.current = new Path2D(path);
        this.paths.push(this.current)
    }

    get _equal() {
        return isEqual(this.prev, this.matrix)
    }

    _refreshCurrent() {
        if (!this._equal) {
            this.current = new Path2D();
            this.paths.push(this.current)
        }
        this.prev = this.matrix;
    }

    addPath(path: Path2D) {
        this.paths.push(path)
    }

    /**
     * 移动画笔到指定的 (x, y) 位置，开启一个新的子路径。
     * @param x X 坐标
     * @param y Y 坐标
     */
    moveTo(x: number, y: number): void {
        this._refreshCurrent();
        this.current.moveTo(x, y)
    }

    /**
     * 闭合当前子路径，如果当前子路径存在。
     */
    closePath(): void {
        this._refreshCurrent();
        this.current.closePath()
    }

    /**
     * 从当前点绘制一条直线到指定的 (x, y) 位置。
     * @param x X 坐标
     * @param y Y 坐标
     */
    lineTo(x: number, y: number): void {
        this._refreshCurrent();
        this.current.lineTo(x, y)
    }

    /**
     * 绘制二次贝塞尔曲线，从当前点到指定的 (x, y) 位置，控制点为 (x1, y1)。
     * @param x1 控制点X坐标
     * @param y1 控制点Y坐标
     * @param x 终点X坐标
     * @param y 终点Y坐标
     */
    quadraticCurveTo(x1: number, y1: number, x: number, y: number): void {
        this._refreshCurrent();
        this.current.quadraticCurveTo(x1, y1, x, y)
    }

    /**
     * 绘制三次贝塞尔曲线，从当前点到指定的 (x, y) 位置，控制点为 (x1, y1) 和 (x2, y2)。
     * @param x1 第一个控制点X坐标
     * @param y1 第一个控制点Y坐标
     * @param x2 第二个控制点X坐标
     * @param y2 第二个控制点Y坐标
     * @param x 终点X坐标
     * @param y 终点Y坐标
     */
    bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void {
        this._refreshCurrent();
        this.current.bezierCurveTo(x1, y1, x2, y2, x, y)
    }

    /**
     * 绘制圆弧，从当前点 (x1, y1) 到指定的 (x2, y2)，并且半径为 r。
     * 根据指定的圆弧半径和切线计算新路径。
     * @param x1 圆弧的起点X坐标
     * @param y1 圆弧的起点Y坐标
     * @param x2 圆弧的终点X坐标
     * @param y2 圆弧的终点Y坐标
     * @param r 圆弧的半径
     */
    arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
        this._refreshCurrent();
        this.current.arcTo(x1, y1, x2, y2, r)
    }

    /**
     * 绘制圆弧，从指定的起点 (x, y) 绘制半径为 r，角度从 a0 到 a1 的圆弧，方向由 ccw 控制。
     * @param x 圆弧的中心X坐标
     * @param y 圆弧的中心Y坐标
     * @param r 圆弧的半径
     * @param a0 起始角度（以弧度表示）
     * @param a1 结束角度（以弧度表示）
     * @param ccw 是否逆时针绘制圆弧，默认值为 false（顺时针）
     */
    arc(x: number, y: number, r: number, a0: number, a1: number, ccw: boolean = false): void {
        this._refreshCurrent();
        this.current.arc(x, y, r, a0, a1, ccw)
    }

    /**
     * 绘制矩形，位置为 (x, y)，宽度为 w，高度为 h。
     * @param x 矩形的起点X坐标
     * @param y 矩形的起点Y坐标
     * @param w 矩形的宽度
     * @param h 矩形的高度
     */
    rect(x: number, y: number, w: number, h: number): void {
        this._refreshCurrent();
        this.current.rect(x, y, w, h)
    }


    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this._refreshCurrent();
        this.current.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }

    roundRect(x: number, y: number, w: number, h: number, radius?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>) {
        this._refreshCurrent();
        this.current.roundRect(x, y, w, h, radius)
    }


    clearRect(x: number, y: number, w: number, h: number) {
        console.log(x, y, w, h)
    }

    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    clip(): void {
    }

    fillText(font: string, text: string, x: number, y: number, maxWidth?: number) {
        const size = measureSize(text, font);
        const width = maxWidth || size.width
        this.rect(x, y, width, size.height)
    }

    reset() {
        this.resetTransform();
    }

    resetTransform(): void {
        this.matrix = new DOMMatrix();
    }

    restore() {
        const p = this.store.pop();
        if (p) {
            this.matrix = p;
        }
    }

    save(): void {
        this.store.push(this.matrix)
    }

    rotate(angle: number): void {
        this.matrix = this.matrix.rotate(angle);
    }

    scale(x: number, y: number): void {
        this.matrix = this.matrix.scale(x, y);
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.matrix = this.matrix.multiply({a, b, c, d, e, f});
    }

    translate(x: number, y: number): void {
        this.matrix = this.matrix.translate(x, y);
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    setTransform(...rest: unknown[]): void {
        // eslint-disable-next-line prefer-rest-params
        if (rest.length == 1 && typeof rest === 'object') {
            // eslint-disable-next-line prefer-rest-params
            this.matrix = DOMMatrix.fromMatrix(rest[0] as DOMMatrix2DInit);
        } else {
            // eslint-disable-next-line prefer-rest-params
            this.matrix = new DOMMatrix(...(rest as (string)[]));
        }
    }

    toString(): string {
        const path = this.paths.map(p => p.toString()).join('');
        const {a, b, c, d, e, f} = this.matrix;
        return new SVGPathData(path).matrix(a, b, c, d, e, f).encode();
    }

    getBBox() {
        const path = this.paths.map(p => p.toString()).join('');
        const {a, b, c, d, e, f} = this.matrix;
        const segment = new SVGPathData(path).matrix(a, b, c, d, e, f);
        const {minX, minY, maxX, maxY} = segment.getBounds()
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        }
    }
}

