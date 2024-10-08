import Group from "./Group";
import {Color, createFilledImageData} from "./Util";
import {PointLike, RGBA} from "./interface";
import Path2D, {PathContext} from "./Path2D";
// 创建一个新的 canvas 元素
const tempSource = document.createElement('canvas');
export const ContextAttrs = [
    "direction",
    'fillStyle',
    'filter',
    'font',
    'fontKerning',
    'fontStretch',
    'fontVariantCaps',
    'globalAlpha',
    'globalCompositeOperation',
    'imageSmoothingEnabled',
    'imageSmoothingQuality',
    'letterSpacing',
    'lineCap',
    'lineDashOffset',
    'lineJoin',
    'lineWidth',
    'miterLimit',
    'shadowBlur',
    'shadowColor',
    'shadowOffsetX',
    'shadowOffsetY',
    'strokeStyle',
    'textAlign',
    'textBaseline',
    'textRendering',
    'wordSpacing'
] as const

export default class Context implements CanvasRenderingContext2D {
    direction: CanvasDirection;
    fillStyle: string | CanvasGradient | CanvasPattern;
    filter: string;
    font: string;
    fontKerning: CanvasFontKerning;
    fontStretch: CanvasFontStretch;
    fontVariantCaps: CanvasFontVariantCaps;
    globalAlpha: number;
    globalCompositeOperation: GlobalCompositeOperation;
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: ImageSmoothingQuality;
    letterSpacing: string;
    lineCap: CanvasLineCap;
    lineDashOffset: number;
    lineJoin: CanvasLineJoin;
    lineWidth: number;
    miterLimit: number;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
    textRendering: CanvasTextRendering;
    wordSpacing: string;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.#context = canvas.getContext('2d')!;
        this.offscreen = document.createElement('canvas');

        this.#offscreenContext = this.offscreen.getContext('2d', {willReadFrequently: true})!;
        this.direction = this.#context.direction;
        this.fillStyle = this.#context.fillStyle;
        this.filter = this.#context.filter;
        this.font = this.#context.filter;
        this.fontKerning = this.#context.fontKerning;
        this.fontStretch = this.#context.fontStretch;
        this.fontVariantCaps = this.#context.fontVariantCaps;
        this.globalAlpha = this.#context.globalAlpha;
        this.globalCompositeOperation = this.#context.globalCompositeOperation;
        this.imageSmoothingEnabled = this.#context.imageSmoothingEnabled;
        this.imageSmoothingQuality = this.#context.imageSmoothingQuality;
        this.letterSpacing = this.#context.letterSpacing;
        this.lineCap = this.#context.lineCap;
        this.lineDashOffset = this.#context.lineDashOffset;
        this.lineJoin = this.#context.lineJoin;
        this.lineWidth = this.#context.lineWidth;
        this.miterLimit = this.#context.miterLimit;
        this.shadowBlur = this.#context.shadowBlur;
        this.shadowColor = this.#context.shadowColor;
        this.shadowOffsetX = this.#context.shadowOffsetX;
        this.shadowOffsetY = this.#context.shadowOffsetY;
        this.strokeStyle = this.#context.strokeStyle;
        this.textAlign = this.#context.textAlign;
        this.textBaseline = this.#context.textBaseline;
        this.textRendering = this.#context.textRendering;
        this.wordSpacing = this.#context.wordSpacing;

        ContextAttrs.forEach(attr => {
            Object.defineProperty(this, attr, {
                get() {
                    return this.#context[attr];
                },
                set(val) {
                    this.#context[attr] = val;
                    if (this.current) {
                        if (attr === 'fillStyle') {
                            val = this.current.randomColor;
                        }
                        if (attr === 'globalAlpha') {
                            val = 1;
                        }
                        if (attr === "strokeStyle") {
                            val = this.current.randomColor;
                        }
                    }
                    this.#offscreenContext[attr] = val;
                }
            })
        });


    }

    readonly #context: CanvasRenderingContext2D;

    readonly #offscreenContext: CanvasRenderingContext2D;
    public current: Group | null = null
    readonly canvas: HTMLCanvasElement;
    readonly offscreen: HTMLCanvasElement;
    public path: PathContext = new PathContext()

    getOffscreenColorByPoint(point: PointLike) {
        const imageData = this.#offscreenContext.getImageData(point.x, point.y, 1, 1);
        const data = imageData.data;
        if (data[3] === 0) {
            return 'transparent'
        }
        return `#${Color.rgbToHex(data[0], data[1], data[2])}`
    }

    getBoundingClientRect(targetColor: RGBA) {
        const imageData = this.#offscreenContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const {data, width, height} = imageData;
        const {r, g, b} = targetColor;

        let minX = width, minY = height, maxX = 0, maxY = 0;
        let found = false;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                if (data[index] === r && data[index + 1] === g && data[index + 2] === b) {
                    found = true;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (!found) {
            return null; // 目标颜色未找到
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.#offscreenContext.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        this.#context.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        this.path.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this.#offscreenContext.arcTo(x1, y1, x2, y2, radius)
        this.#context.arcTo(x1, y1, x2, y2, radius)
        this.path.arcTo(x1, y1, x2, y2, radius)
    }

    beginPath(): void {
        this.#offscreenContext.beginPath();
        this.#context.beginPath();
        this.path.moveTo(0, 0);
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.#offscreenContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.#context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.path.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.clearRect(x, y, w, h)
        this.#context.clearRect(x, y, w, h)
        this.path.clearRect(x, y, w, h)
    }

    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    clip(): void {
        // eslint-disable-next-line prefer-rest-params
        this.#offscreenContext.clip(...arguments)
        // eslint-disable-next-line prefer-rest-params
        this.#context.clip(...arguments)
        // eslint-disable-next-line prefer-rest-params
        this.path.clip(...arguments)
    }

    closePath(): void {
        this.#offscreenContext.closePath()
        this.#context.closePath()
        this.path.closePath()
    }

    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
        return this.#context.createConicGradient(startAngle, x, y);
    }

    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    createImageData(sw: number | ImageData, sh?: number, settings?: ImageDataSettings): ImageData {
        if (arguments.length === 1) {
            return this.#context.createImageData(sw as ImageData);
        }
        return this.#context.createImageData(sw as number, sh!, settings);
    }

    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        return this.#context.createLinearGradient(x0, y0, x1, y1);
    }

    createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null {
        return this.#context.createPattern(image, repetition);
    }

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
        return this.#context.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }

    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    drawFocusIfNeeded(ele: Element | Path2D, element?: Element): void {
        if (arguments.length === 1) {
            this.#offscreenContext.drawFocusIfNeeded(ele as Element)
            this.#context.drawFocusIfNeeded(ele as Element);
            return;
        }
        this.#offscreenContext.drawFocusIfNeeded(ele as Path2D, element!)
        this.#context.drawFocusIfNeeded(ele as Path2D, element!)
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sdx: number, sdy: number, sdw?: number, sdh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
        let source = image
        if (this.current) {
            if (this.current.randomColor) {
                let width: number;
                let height: number;
                if (source instanceof VideoFrame) {
                    width = source.displayWidth;
                    height = source.displayHeight;
                } else {
                    if (source instanceof SVGImageElement) {
                        width = source.width.baseVal.value;
                        height = source.height.baseVal.value;
                    } else {
                        width = source.width;
                        height = source.height;
                    }
                }
                source = tempSource
                // 设置 canvas 的宽高与 ImageData 相同
                source.width = width;
                source.height = height;
                // 获取 2D 渲染上下文
                const ctx = source.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = this.current.randomColor
                    ctx.fillRect(0, 0, width, height);
                }
            }
        }
        if (arguments.length === 3) {
            this.#offscreenContext.drawImage(source, sdx, sdy)
            this.#context.drawImage(image, sdx, sdy);
            this.#offscreenContext.drawImage(source, sdx, sdy);
            const _source = source as HTMLCanvasElement
            this.path.rect(sdx, sdy, _source.width, _source.height)
            return;
        }
        if (arguments.length === 5) {
            this.#offscreenContext.drawImage(source, sdx, sdy, sdw!, sdh!)
            this.#context.drawImage(image, sdx, sdy, sdw!, sdh!);
            this.#offscreenContext.drawImage(source, sdx, sdy, sdw!, sdh!)
            this.path.rect(sdx, sdy, sdw!, sdh!)
            return;
        }
        this.#offscreenContext.drawImage(source, sdx, sdy, sdw!, sdh!, dx!, dy!, dw!, dh!)
        this.#context.drawImage(image, sdx, sdy, sdw!, sdh!, dx!, dy!, dw!, dh!)
        this.path.rect(sdx, sdy, sdw!, sdh!)
    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.#offscreenContext.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.#context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.path.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }

    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    fill(): void {
        // eslint-disable-next-line prefer-rest-params
        this.#offscreenContext.fill(...arguments)
        // eslint-disable-next-line prefer-rest-params
        this.#context.fill(...arguments)
        // eslint-disable-next-line prefer-rest-params
        const path = arguments[0];
        if (path instanceof Path2D) {
            this.path.addPath(path)
        }
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.fillRect(x, y, w, h)
        this.#context.fillRect(x, y, w, h)
        this.path.rect(x, y, w, h)
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#offscreenContext.fillText(text, x, y, maxWidth)
        this.#context.fillText(text, x, y, maxWidth)
        this.path.fillText(this.font, text, x, y, maxWidth)
    }

    getContextAttributes(): CanvasRenderingContext2DSettings {
        return this.#context.getContextAttributes();
    }

    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData {
        return this.#context.getImageData(sx, sy, sw, sh, settings);
    }

    getLineDash(): number[] {
        return this.#context.getLineDash();
    }

    getTransform(): DOMMatrix {
        return this.#context.getTransform();
    }

    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(x: number | Path2D, xOrY: number, yOrFillRule?: CanvasFillRule | number, fillRule?: CanvasFillRule): boolean {
        if ([2, 3].includes(arguments.length)) {
            return this.#context.isPointInPath(x as Path2D, xOrY, yOrFillRule as number);
        }
        return this.#context.isPointInPath(x as Path2D, xOrY, yOrFillRule as number, fillRule);
    }

    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    isPointInStroke(x: number | Path2D, xOrY: number, y?: number): boolean {
        if (arguments.length === 2) {
            return this.#context.isPointInStroke(x as number, xOrY);
        }
        return this.#context.isPointInStroke(x as Path2D, xOrY, y!);
    }

    lineTo(x: number, y: number): void {
        this.#offscreenContext.lineTo(x, y)
        this.#context.lineTo(x, y)
        this.path.lineTo(x, y)
    }

    measureText(text: string): TextMetrics {
        return this.#context.measureText(text);
    }

    moveTo(x: number, y: number): void {
        this.#offscreenContext.moveTo(x, y)
        this.#context.moveTo(x, y)
        this.path.moveTo(x, y)
    }

    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
        let imageData = imagedata as ImageData;
        if (this.current) {
            const color = Color.colorToRGBA(this.current.randomColor)
            if (color) {
                const {r, g, b, a} = color;
                imageData = createFilledImageData(imageData, [r, g, b, a])
            }
        }

        if (arguments.length <= 3) {
            this.#offscreenContext.putImageData(imageData, dx, dy)
            this.#context.putImageData(imagedata, dx, dy)
            this.#context.putImageData(imagedata, dx, dy)
            this.path.rect(dx, dy, imagedata.width!, imagedata.height!)
            return
        }
        this.#offscreenContext.putImageData(imageData, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!)
        this.#context.putImageData(imagedata, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!)
        this.path.rect(dx, dy, dirtyWidth!, dirtyHeight!)

    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.#offscreenContext.quadraticCurveTo(cpx, cpy, x, y)
        this.#context.quadraticCurveTo(cpx, cpy, x, y)
        this.path.quadraticCurveTo(cpx, cpy, x, y)
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.rect(x, y, w, h)
        this.#context.rect(x, y, w, h)
        this.path.rect(x, y, w, h)
    }

    reset(): void {
        this.#offscreenContext.reset()
        this.#context.reset()
        this.path.reset()
    }

    resetTransform(): void {
        this.#offscreenContext.resetTransform()
        this.#context.resetTransform();
        this.path.resetTransform();
    }

    restore(): void {
        this.#offscreenContext.restore()
        this.#context.restore()
        this.path.restore()
    }

    rotate(angle: number): void {
        this.#offscreenContext.rotate(angle)
        this.#context.rotate(angle)
        this.path.rotate(angle)
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>): void {
        this.#offscreenContext.roundRect(x, y, w, h, radii)
        this.#context.roundRect(x, y, w, h, radii)
        this.path.roundRect(x, y, w, h, radii)
    }

    save(): void {
        this.#offscreenContext.save();
        this.#context.save();
        this.path.save();
    }

    scale(x: number, y: number): void {
        this.#offscreenContext.scale(x, y);
        this.#context.scale(x, y);
        this.path.scale(x, y);
    }

    setLineDash(segments: number[]): void;
    setLineDash(segments: Iterable<number>): void;
    setLineDash(segments: number[] | Iterable<number>): void {
        this.#offscreenContext.setLineDash(segments);
        this.#context.setLineDash(segments);
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    setTransform(): void {
        // eslint-disable-next-line prefer-rest-params
        this.#offscreenContext.setTransform(...arguments);
        // eslint-disable-next-line prefer-rest-params
        this.#context.setTransform(...arguments);
        // eslint-disable-next-line prefer-rest-params
        this.path.setTransform(...arguments);
    }

    stroke(): void;
    stroke(path: Path2D): void;
    stroke(path?: Path2D): void {
        if (!arguments.length) {
            this.#offscreenContext.stroke();
            this.#context.stroke();
            return
        }
        this.#offscreenContext.stroke(path as Path2D);
        this.#context.stroke(path as Path2D);
        this.path.addPath(path as Path2D)
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.strokeRect(x, y, w, h)
        this.#context.strokeRect(x, y, w, h)
        this.path.rect(x - this.lineWidth / 2, y - this.lineWidth / 2, w + this.lineWidth, h + this.lineWidth)
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#offscreenContext.strokeText(text, x, y, maxWidth)
        this.#context.strokeText(text, x, y, maxWidth);
        this.path.fillText(this.font, text, x, y, maxWidth)
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.#offscreenContext.transform(a, b, c, d, e, f)
        this.#context.transform(a, b, c, d, e, f)
        this.path.transform(a, b, c, d, e, f)
    }

    translate(x: number, y: number): void {
        this.#offscreenContext.translate(x, y)
        this.#context.translate(x, y)
        this.path.translate(x, y)
    }
}
