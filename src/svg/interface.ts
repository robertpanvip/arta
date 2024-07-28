// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SVG {

    export interface FilterColor {
        "color-interpolation-filters": "auto" | "sRGB" | "linearRGB" | "inherit"
    }

    export interface FilterPrimitiveWithIn {
        in: string;
        'std-deviation': string;
    }

    export interface FilterPrimitive {
        x: number;
        y: number;
        width: number;
        height: number;
        result: string;
    }

    export interface Paint {
        "fill": string;
        "fill-rule": string;
        "stroke": string;
        "stroke-dasharray": string;
        "stroke-dashoffset": string;
        "stroke-linecap": "butt" | "round" | "square" | "inherit";
        "stroke-linejoin": "miter" | "round" | "bevel" | "inherit";
        "stroke-miterlimit": string;
        "stroke-width": string;
    }

    export interface Opacity {
        "opacity": string;
        "fill-opacity": string;
        "stroke-opacity": string
    }

    export interface Mask {
        "mask": string;
        "mask-content-units": string;
        "mask-units": string
    }

    export interface Clip {
        "clip-path": string
        "clip-rule": string
    }

    export interface Core {
        id: string;
    }

    export type Color = {
        colo: string
    }
    export type Filter = {
        filter: string
    }
    export type Cursor = {
        cursor: string
    };

    export interface XLink {
        xlinkHref: string;
    }

    export interface XLinkRequired {

    }

    export type Gradient = {
        "stop-color": string,
        "stop-opacity": string,
    }

    export interface Font {
        "font-family"?: string | undefined;
        "font-size"?: number | string | undefined;
        "font-style"?: number | string | undefined;
        "font-weight"?: "normal"
            | "bold"
            | "bolder"
            | "lighter"
            | "100"
            | "200"
            | "300"
            | "400"
            | "500"
            | "600"
            | "700"
            | "800"
            | "900"
            | "inherit";
        "font-size-adjust"?: number | string | undefined;
        "font-stretch"?: number | string | undefined;
        "font-variant"?: number | string | undefined;
    }


    export type TextContent = {
        "alignment-baseline": "auto"
            | "baseline"
            | "before-edge"
            | "text-before-edge"
            | "middle"
            | "central"
            | "after-edge"
            | "text-after-edge"
            | "ideographic"
            | "alphabetic"
            | "hanging"
            | "mathematical"
            | "inherit";
        "baseline-shift": string;
        "direction": 'ltr' | "rtl" | "inherit";
        "dominant-baseline": "auto"
            | "use-script"
            | "no-change"
            | "reset-size"
            | "ideographic"
            | "alphabetic"
            | "hanging"
            | "mathematical"
            | "central"
            | "middle"
            | "text-after-edge"
            | "text-before-edge"
            | "inherit"
        "glyph-orientation-horizontal": string;
        "glyph-orientation-vertical": string;
        "kerning": string;
        "letter-spacing": string;
        "text-anchor": "start" | "middle" | "end" | "inherit";
        "text-decoration": string;
        "unicode-bidi": "normal" | "embed" | "bidi-override" | "inherit";
        "word-spacing": string
    }

    export interface Shape extends Core, Paint, Color, Opacity, Clip, Mask, Filter, Cursor {
        transform: string
    }
}

export interface PathConfig extends SVG.Shape {
    d: string;
    "path-length": number
}

export interface RectConfig extends SVG.Shape {
    x: number;
    y: number;
    rx: number;
    ry: number;
    width: number;
    height: number;
}

export interface CircleConfig extends SVG.Shape {
    cx: number,
    cy: number,
    r: number,
}

export interface LineConfig extends SVG.Shape {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
}

export interface EllipseConfig extends SVG.Shape {
    cx: number;
    cy: number;
    rx: number;
    ry: number
}

export interface PolygonConfig extends SVG.Shape {
    points: string;
}

export interface FontConfig extends SVG.Core, SVG.Font, SVG.Paint, SVG.Color, SVG.Opacity, SVG.Clip, SVG.Mask, SVG.Filter, SVG.Cursor {
    points: string;
    x: number;
    y: number;
    rotate: number;
    transform: string;
}

export interface TextConfig extends SVG.Core, SVG.Font, SVG.Paint, SVG.Color, SVG.Opacity, SVG.Clip, SVG.Mask, SVG.Filter, SVG.Cursor {
    x: number;
    y: number;
    rotate: number;
    transform: string;
}

export interface TextPathConfig extends SVG.Core, SVG.TextContent, SVG.Font, SVG.Paint, SVG.Color, SVG.Opacity, SVG.Clip, SVG.Mask, SVG.Filter, SVG.Cursor, SVG.XLinkRequired {
    startOffset: string,
    textLength: string,
    lengthAdjust: "spacing" | "spacingAndGlyphs",
    method: "align" | "stretch",
    spacing: "auto" | "exact"
}


export interface FilterConfig extends SVG.Core, SVG.XLink {
    x: number,
    y: number,
    width: number,
    height: number,
    filterRes: number,
    filterUnits: "userSpaceOnUse" | "objectBoundingBox",
    primitiveUnits: "userSpaceOnUse" | "objectBoundingBox"
}


export interface FeGaussianBlurConfig extends SVG.Core, SVG.FilterColor, SVG.FilterPrimitiveWithIn {

}

export interface FeOffsetConfig extends SVG.Core, SVG.FilterColor, SVG.FilterPrimitiveWithIn {
    dx: number,
    dy: number;
    "flood-color": number;// 属性定义了阴影的颜色，默认为黑色
    "flood-opacity": number;// 属性定义了阴影的不透明度，默认为1（完全不透明）
    "lighting-color": string
}

export interface linearGradientConfig extends SVG.Core,
    SVG.Color,
    SVG.Gradient,
    SVG.XLink {
    x1: number;
    y1: number
    x2: number;
    y2: number;
    "gradient-units": "objectBoundingBox" | "userSpaceOnUse"
    "gradient-transform": string;
    "spread-method": "pad" | "reflect" | "repeat"
}

export interface StopConfig extends SVG.Core, SVG.Color, SVG.Gradient {
    offset: number
}