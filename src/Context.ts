const attrs = [
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
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.#context = canvas.getContext('2d')!;
        this.offscreen = document.createElement('canvas');
        this.#offscreenContext = this.offscreen.getContext('2d')!;
        attrs.forEach(attr => {
            Object.defineProperty(this, attr, {
                get() {
                    this[attr] = this.#context[attr];
                },
                set(val) {
                    this.#context[attr] = val
                }
            })
        })
    }

    globalAlpha: number;
    globalCompositeOperation: GlobalCompositeOperation;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    filter: string;
    imageSmoothingEnabled: boolean;
    imageSmoothingQuality: ImageSmoothingQuality;
    lineCap: CanvasLineCap;
    lineDashOffset: number;
    lineJoin: CanvasLineJoin;
    lineWidth: number;
    miterLimit: number;
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
    shadowOffsetY: number;
    direction: CanvasDirection;
    font: string;
    fontKerning: CanvasFontKerning;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;

    readonly #context: CanvasRenderingContext2D;

    readonly #offscreenContext: CanvasRenderingContext2D;

    readonly canvas: HTMLCanvasElement;
    readonly offscreen: HTMLCanvasElement;

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.#offscreenContext.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        return this.#context.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    }

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        return this.#context.arcTo(x1, y1, x2, y2, radius)
    }

    beginPath(): void {
        this.#context.beginPath();
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.#context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.#context.clearRect(x, y, w, h)
    }

    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    clip(pathOrFillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
        this.#context.clip(pathOrFillRule as Path2D, fillRule)
    }

    closePath(): void {
        this.#context.closePath()
    }

    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
        return this.#context.createConicGradient(startAngle, x, y);
    }

    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    createImageData(sw: number | ImageData, sh?: number, settings?: ImageDataSettings): ImageData {
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
        this.#context.drawFocusIfNeeded(ele as Path2D, element!)
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sdx: number, sdy: number, sdw?: number, sdh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
        this.#context.drawImage(image, sdx, sdy, sdw!, sdh!, dx!, dy!, dw!, dh!)
    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.#context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }

    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    fill(pathOrFillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
        this.#context.fill(pathOrFillRule as Path2D, fillRule)
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.#context.fillRect(x, y, w, h)
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#context.fillText(text, x, y, maxWidth)
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
        return this.#context.isPointInPath(x as Path2D, xOrY, yOrFillRule as number, fillRule);
    }

    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    isPointInStroke(x: number | Path2D, xOrY: number, y?: number): boolean {
        return this.#context.isPointInStroke(x as Path2D, xOrY, y!);
    }

    lineTo(x: number, y: number): void {
        this.#context.lineTo(x, y)
    }

    measureText(text: string): TextMetrics {
        return this.#context.measureText(text);
    }

    moveTo(x: number, y: number): void {
        this.#context.moveTo(x, y)
    }

    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
        this.putImageData(imagedata, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!)
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.#context.quadraticCurveTo(cpx, cpy, x, y)
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.#context.rect(x, y, w, h)
    }

    reset(): void {
        this.#context.reset()
    }

    resetTransform(): void {
        this.#context.resetTransform()
    }

    restore(): void {
        this.#context.restore()
    }

    rotate(angle: number): void {
        this.#context.rotate(angle)
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>): void {
        this.#context.roundRect(x, y, w, h, radii)
    }

    save(): void {
        this.#context.save();
    }

    scale(x: number, y: number): void {
        this.#context.scale(x, y);
    }

    setLineDash(segments: number[]): void;
    setLineDash(segments: Iterable<number>): void;
    setLineDash(segments: number[] | Iterable<number>): void {
        this.#context.setLineDash(segments);
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    setTransform(a?: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void {
        this.#context.setTransform(a! as number, b!, c!, d!, e!, f!);
    }

    stroke(): void;
    stroke(path: Path2D): void;
    stroke(path?: Path2D): void {
        this.#context.stroke(path as Path2D);
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.#context.strokeRect(x, y, w, h)
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#context.strokeText(text, x, y, maxWidth)
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.#context.transform(a, b, c, d, e, f)
    }

    translate(x: number, y: number): void {
        this.#context.translate(x, y)
    }

}
