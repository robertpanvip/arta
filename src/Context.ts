export default class Context implements CanvasRenderingContext2D {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.#context = canvas.getContext('2d')!;
        this.offscreen = document.createElement('canvas');
        this.#offscreenContext = this.offscreen.getContext('2d')!;
    }

    readonly #context: CanvasRenderingContext2D;

    readonly #offscreenContext: CanvasRenderingContext2D;

    readonly canvas: HTMLCanvasElement;
    readonly offscreen: HTMLCanvasElement;
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
    }

    clearRect(x: number, y: number, w: number, h: number): void {
    }

    clip(fillRule?: CanvasFillRule): void;
    clip(path: Path2D, fillRule?: CanvasFillRule): void;
    clip(fillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
    }

    closePath(): void {
    }

    createConicGradient(startAngle: number, x: number, y: number): CanvasGradient {
        return undefined;
    }

    createImageData(sw: number, sh: number, settings?: ImageDataSettings): ImageData;
    createImageData(imagedata: ImageData): ImageData;
    createImageData(sw: number | ImageData, sh?: number, settings?: ImageDataSettings): ImageData {
        return undefined;
    }

    createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
        return undefined;
    }

    createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null {
        return undefined;
    }

    createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
        return undefined;
    }

    drawFocusIfNeeded(element: Element): void;
    drawFocusIfNeeded(path: Path2D, element: Element): void;
    drawFocusIfNeeded(element: Element | Path2D, element?: Element): void {
    }

    drawImage(image: CanvasImageSource, dx: number, dy: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
    drawImage(image: CanvasImageSource, dx: number, dy: number, dw?: number, dh?: number, dx?: number, dy?: number, dw?: number, dh?: number): void {
    }

    ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void {
    }

    fill(fillRule?: CanvasFillRule): void;
    fill(path: Path2D, fillRule?: CanvasFillRule): void;
    fill(fillRule?: CanvasFillRule | Path2D, fillRule?: CanvasFillRule): void {
    }

    fillRect(x: number, y: number, w: number, h: number): void {
    }

    fillText(text: string, x: number, y: number, maxWidth?: number): void {
    }

    getContextAttributes(): CanvasRenderingContext2DSettings {
        return undefined;
    }

    getImageData(sx: number, sy: number, sw: number, sh: number, settings?: ImageDataSettings): ImageData {
        return undefined;
    }

    getLineDash(): number[] {
        return [];
    }

    getTransform(): DOMMatrix {
        return undefined;
    }

    isPointInPath(x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(path: Path2D, x: number, y: number, fillRule?: CanvasFillRule): boolean;
    isPointInPath(x: number | Path2D, y: number, fillRule?: CanvasFillRule | number, fillRule?: CanvasFillRule): boolean {
        return false;
    }

    isPointInStroke(x: number, y: number): boolean;
    isPointInStroke(path: Path2D, x: number, y: number): boolean;
    isPointInStroke(x: number | Path2D, y: number, y?: number): boolean {
        return false;
    }

    lineTo(x: number, y: number): void {
    }

    measureText(text: string): TextMetrics {
        return undefined;
    }

    moveTo(x: number, y: number): void {
    }

    putImageData(imagedata: ImageData, dx: number, dy: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
    putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number, dirtyWidth?: number, dirtyHeight?: number): void {
    }

    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    }

    rect(x: number, y: number, w: number, h: number): void {
    }

    reset(): void {
    }

    resetTransform(): void {
    }

    restore(): void {
    }

    rotate(angle: number): void {
    }

    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[]): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | Iterable<number | DOMPointInit>): void;
    roundRect(x: number, y: number, w: number, h: number, radii?: number | DOMPointInit | (number | DOMPointInit)[] | Iterable<number | DOMPointInit>): void {
    }

    save(): void {
    }

    scale(x: number, y: number): void {
    }

    setLineDash(segments: number[]): void;
    setLineDash(segments: Iterable<number>): void;
    setLineDash(segments: number[] | Iterable<number>): void {
    }

    setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
    setTransform(transform?: DOMMatrix2DInit): void;
    setTransform(a?: number | DOMMatrix2DInit, b?: number, c?: number, d?: number, e?: number, f?: number): void {
    }

    stroke(): void;
    stroke(path: Path2D): void;
    stroke(path?: Path2D): void {
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
    }

    strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    }

    transform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    }

    translate(x: number, y: number): void {
    }

}