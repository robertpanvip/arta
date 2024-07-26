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
        });
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
        this.#offscreenContext.arcTo(x1, y1, x2, y2, radius)
        return this.#context.arcTo(x1, y1, x2, y2, radius)
    }

    beginPath(): void {
        this.#offscreenContext.beginPath();
        this.#context.beginPath();
    }

    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void {
        this.#offscreenContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
        this.#context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.clearRect(x, y, w, h)
        this.#context.clearRect(x, y, w, h)
    }

    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    clip(pathOrFillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
        this.#offscreenContext.clip(pathOrFillRule as Path2D, fillRule)
        this.#context.clip(pathOrFillRule as Path2D, fillRule)
    }

    closePath(): void {
        this.#offscreenContext.closePath()
        this.#context.closePath()
    }

    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
        this.#offscreenContext.createConicGradient(startAngle, x, y)
        return this.#context.createConicGradient(startAngle, x, y);
    }

    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    createImageData(sw: number | ImageData, sh?: number, settings?: ImageDataSettings): ImageData {
        this.#offscreenContext.createImageData(sw as number, sh!, settings)
        return this.#context.createImageData(sw as number, sh!, settings);
    }

    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        this.#offscreenContext.createLinearGradient(x0, y0, x1, y1)
        return this.#context.createLinearGradient(x0, y0, x1, y1);
    }

    createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null {
        this.#offscreenContext.createPattern(image, repetition)
        return this.#context.createPattern(image, repetition);
    }

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
        this.#offscreenContext.createRadialGradient(x0, y0, r0, x1, y1, r1)
        return this.#context.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }

    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    drawFocusIfNeeded(ele: Element | Path2D, element?: Element): void {
        this.#offscreenContext.drawFocusIfNeeded(ele as Path2D, element!)
        this.#context.drawFocusIfNeeded(ele as Path2D, element!)
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sdx: number, sdy: number, sdw?: number, sdh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
        this.#offscreenContext.drawImage(image, sdx, sdy, sdw!, sdh!, dx!, dy!, dw!, dh!)
        this.#context.drawImage(image, sdx, sdy, sdw!, sdh!, dx!, dy!, dw!, dh!)
    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
        this.#offscreenContext.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
        this.#context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)
    }

    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    fill(pathOrFillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
        this.#offscreenContext.fill(pathOrFillRule as Path2D, fillRule)
        this.#context.fill(pathOrFillRule as Path2D, fillRule)
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.fillRect(x, y, w, h)
        this.#context.fillRect(x, y, w, h)
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#offscreenContext.fillText(text, x, y, maxWidth)
        this.#context.fillText(text, x, y, maxWidth)
    }

    getContextAttributes(): CanvasRenderingContext2DSettings {
        this.#offscreenContext.getContextAttributes()
        return this.#context.getContextAttributes();
    }

    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData {
        this.#offscreenContext.getImageData(sx, sy, sw, sh, settings)
        return this.#context.getImageData(sx, sy, sw, sh, settings);
    }

    getLineDash(): number[] {
        this.#offscreenContext.getLineDash()
        return this.#context.getLineDash();
    }

    getTransform(): DOMMatrix {
        this.#offscreenContext.getTransform();
        return this.#context.getTransform();
    }

    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(x: number | Path2D, xOrY: number, yOrFillRule?: CanvasFillRule | number, fillRule?: CanvasFillRule): boolean {
        this.#offscreenContext.isPointInPath(x as Path2D, xOrY, yOrFillRule as number, fillRule);
        return this.#context.isPointInPath(x as Path2D, xOrY, yOrFillRule as number, fillRule);
    }

    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    isPointInStroke(x: number | Path2D, xOrY: number, y?: number): boolean {
        this.#offscreenContext.isPointInStroke(x as Path2D, xOrY, y!)
        return this.#context.isPointInStroke(x as Path2D, xOrY, y!);
    }

    lineTo(x: number, y: number): void {
        this.#offscreenContext.lineTo(x, y)
        this.#context.lineTo(x, y)
    }

    measureText(text: string): TextMetrics {
        this.#offscreenContext.measureText(text)
        return this.#context.measureText(text);
    }

    moveTo(x: number, y: number): void {
        this.#offscreenContext.moveTo(x, y)
        this.#context.moveTo(x, y)
    }

    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
        this.#offscreenContext.putImageData(imagedata, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!)
        this.#context.putImageData(imagedata, dx, dy, dirtyX!, dirtyY!, dirtyWidth!, dirtyHeight!)
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
        this.#offscreenContext.quadraticCurveTo(cpx, cpy, x, y)
        this.#context.quadraticCurveTo(cpx, cpy, x, y)
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.rect(x, y, w, h)
        this.#context.rect(x, y, w, h)
    }

    reset(): void {
        this.#offscreenContext.reset()
        this.#context.reset()
    }

    resetTransform(): void {
        this.#offscreenContext.resetTransform()
        this.#context.resetTransform()
    }

    restore(): void {
        this.#offscreenContext.restore()
        this.#context.restore()
    }

    rotate(angle: number): void {
        this.#offscreenContext.rotate(angle)
        this.#context.rotate(angle)
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>): void {
        this.#offscreenContext.roundRect(x, y, w, h, radii)
        this.#context.roundRect(x, y, w, h, radii)
    }

    save(): void {
        this.#offscreenContext.save();
        this.#context.save();
    }

    scale(x: number, y: number): void {
        this.#offscreenContext.scale(x, y);
        this.#context.scale(x, y);
    }

    setLineDash(segments: number[]): void;
    setLineDash(segments: Iterable<number>): void;
    setLineDash(segments: number[] | Iterable<number>): void {
        this.#offscreenContext.setLineDash(segments);
        this.#context.setLineDash(segments);
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    setTransform(a?: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void {
        this.#offscreenContext.setTransform(a! as number, b!, c!, d!, e!, f!);
        this.#context.setTransform(a! as number, b!, c!, d!, e!, f!);
    }

    stroke(): void;
    stroke(path: Path2D): void;
    stroke(path?: Path2D): void {
        this.#offscreenContext.stroke(path as Path2D);
        this.#context.stroke(path as Path2D);
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.#offscreenContext.strokeRect(x, y, w, h)
        this.#context.strokeRect(x, y, w, h)
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
        this.#offscreenContext.strokeText(text, x, y, maxWidth)
        this.#context.strokeText(text, x, y, maxWidth)
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
        this.#offscreenContext.transform(a, b, c, d, e, f)
        this.#context.transform(a, b, c, d, e, f)
    }

    translate(x: number, y: number): void {
        this.#offscreenContext.translate(x, y)
        this.#context.translate(x, y)
    }

}
