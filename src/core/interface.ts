export interface Translation {
    tx: number;
    ty: number;
}

export type PointLike = {
    x: number,
    y: number
}
export interface TangentPoint extends PointLike {
    angle: number,
    w: number,
    word: string,
    next: PointLike,
}
export type ScreenPointLike = {
    screenX: number,
    screenY: number
}
export type Scale = {
    sx: number,
    sy: number
}

export interface Rotation {
    angle: number
    cx?: number
    cy?: number
}

export interface MatrixLike {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}

export interface MatrixLike {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}

export interface RectangleLike {
    x: number
    y: number
    width: number
    height: number
}

export type Scaling = {
    min: number,
    max: number
}

export type SvgAttr = {
    id: string;
    fill: string;
    fillOpacity: string | number

    filter: string
    fillRule: CanvasFillRule;

    stroke: string;
    strokeOpacity: string | number;
    strokeDasharray: string;
    strokeDashoffset: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    strokeMiterlimit: string;
    strokeWidth: string | number;
    opacity: string | number;

    style: Partial<Omit<SvgAttr, "style">>
}

export type CanvasStyle={
    direction:CanvasDirection;
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
}

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBA extends RGB {
    a: number;
}

export interface GetSet<Type, This> {
    (): Type;
    (v: Type): This;
}

export interface PathSegment {
    command:
        | 'm'
        | 'M'
        | 'l'
        | 'L'
        | 'v'
        | 'V'
        | 'h'
        | 'H'
        | 'z'
        | 'Z'
        | 'c'
        | 'C'
        | 'q'
        | 'Q'
        | 't'
        | 'T'
        | 's'
        | 'S'
        | 'a'
        | 'A';
    start: PointLike;
    points: number[];
    pathLength: number;
}