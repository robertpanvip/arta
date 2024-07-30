import {MatrixLike, PointLike, RGB, RGBA, Rotation, Scale, TangentPoint, Translation} from "./interface.ts";

function deltaTransformPoint(matrix: DOMMatrix | MatrixLike, point: PointLike) {
    const dx = point.x * matrix.a + point.y * matrix.c
    const dy = point.x * matrix.b + point.y * matrix.d
    return {x: dx, y: dy}
}

export function matrixToRotation(matrix: DOMMatrix | MatrixLike): Rotation {
    let p = {x: 0, y: 1}
    if (matrix) {
        p = deltaTransformPoint(matrix, p)
    }

    const deg = (((180 * Math.atan2(p.y, p.x)) / Math.PI) % 360) - 90
    const angle = (deg % 360) + (deg < 0 ? 360 : 0)
    return {
        angle,
    }
}


export function matrixToTranslation(
    matrix: DOMMatrix | MatrixLike
): Translation {
    return {
        tx: (matrix && matrix.e) || 0,
        ty: (matrix && matrix.f) || 0,
    };
}

export function matrixToScale(matrix: DOMMatrix): Scale {
    let a;
    let b;
    let c;
    let d;
    if (matrix) {
        a = matrix.a == null ? 1 : matrix.a;
        d = matrix.d == null ? 1 : matrix.d;
        b = matrix.b;
        c = matrix.c;
    } else {
        // eslint-disable-next-line no-multi-assign
        a = d = 1;
    }
    return {
        sx: b ? Math.sqrt(a * a + b * b) : a,
        sy: c ? Math.sqrt(c * c + d * d) : d,
    };
}

export function clamp(number: number, lower: number, upper: number) {
    // 传入的数字进行转换
    number = +number
    lower = +lower
    upper = +upper
    // NaN === NaN false
    // NaN === 1 false
    // +null 0
    // +undefined NaN
    // 处理非数字的情况
    lower = lower === lower ? lower : 0
    upper = upper === upper ? upper : 0
    if (number === number) {
        // 和最大边界值比较，超过最大边界值，返回upper
        number = number <= upper ? number : upper
        // 和最小边界值比较，小于最小边界值，返回lower
        number = number >= lower ? number : lower
    }
    return number
}

/**
 * 将 ImageData 的所有像素改为指定的颜色，返回新的 ImageData 对象
 * @param imageData - 原始的 ImageData 对象
 * @param color - 指定的颜色，格式为 [red, green, blue, alpha]
 * @returns 新的 ImageData 对象
 */
export function createFilledImageData(imageData: {
    width: number,
    height: number
}, color: [number, number, number, number]): ImageData {
    const newImageData = new ImageData(imageData.width, imageData.height);
    const [red, green, blue, alpha] = color;
    const data = newImageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = red;     // 红色分量
        data[i + 1] = green; // 绿色分量
        data[i + 2] = blue;  // 蓝色分量
        data[i + 3] = alpha; // 透明度分量
    }

    return newImageData;
}


const HASH = '#';
const ZERO = '0';
const RGB_REGEX = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
const COLORS = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 132, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 255, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 203],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [119, 128, 144],
    slategrey: [119, 128, 144],
    snow: [255, 255, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    transparent: [255, 255, 255, 0],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 5],
};
const RGB_PAREN = 'rgb(';
const EMPTY_STRING = '';

export class Color {
    static toHex = (n: number) => `${n > 15 ? '' : 0}${n.toString(16)}`

    /**
     * 颜色对象转化为16进制颜色字符串
     * @param colorObj 颜色对象
     */
    static toHexString(colorObj: RGBA) {
        const {
            r, g, b
        } = colorObj;
        /// 将颜色分量转换为两位的十六进制字符串
        const red = r.toString(16).padStart(2, '0');
        const green = g.toString(16).padStart(2, '0');
        const blue = b.toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }

    static parseRgbaColor(color: string) {
        const arr = color.match(/(\d(\.\d+)?)+/g) || [];
        const res = arr.map((s) => parseInt(s, 10));
        return {
            r: res[0],
            g: res[1],
            b: res[2],
            a: parseFloat(arr[3]),
        };
    }

    /**
     * return random hex color
     * @method
     * @memberof Konva.Util
     * @example
     * shape.fill(Konva.Util.getRandomColor());
     */
    static getRandomColor() {
        let randColor = ((Math.random() * 0xffffff) << 0).toString(16);
        while (randColor.length < 6) {
            randColor = ZERO + randColor;
        }
        return HASH + randColor;
    }

    static rgbToHex(r: number, g: number, b: number) {
        return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static hexToRgb(hex: string): RGB {
        hex = hex.replace(HASH, EMPTY_STRING);
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    static colorToRGBA(str: string) {
        str = str || 'black';
        return (
            Color.namedColorToRBA(str) ||
            Color.hex3ColorToRGBA(str) ||
            Color.hex4ColorToRGBA(str) ||
            Color.hex6ColorToRGBA(str) ||
            Color.hex8ColorToRGBA(str) ||
            Color.rgbColorToRGBA(str) ||
            Color.rgbaColorToRGBA(str) ||
            Color.hslColorToRGBA(str)
        );
    }

    // Parse rgb(n, n, n)
    static rgbColorToRGBA(str: string) {
        if (str.indexOf('rgb(') === 0) {
            str = str.match(/rgb\(([^)]+)\)/)![1];
            const parts = str.split(/ *, */).map(Number);
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: 1,
            };
        }
    }

    // Parse rgba(n, n, n, n)
    static rgbaColorToRGBA(str: string) {
        if (str.indexOf('rgba(') === 0) {
            str = str.match(/rgba\(([^)]+)\)/)![1]!;
            const parts = str.split(/ *, */).map((n, index) => {
                if (n.slice(-1) === '%') {
                    return index === 3 ? parseInt(n) / 100 : (parseInt(n) / 100) * 255;
                }
                return Number(n);
            });
            return {
                r: parts[0],
                g: parts[1],
                b: parts[2],
                a: parts[3],
            };
        }
    }

    // Parse named css color. Like "green"
    static namedColorToRBA(str: string) {
        const c = COLORS[str.toLowerCase() as keyof typeof COLORS];
        if (!c) {
            return null;
        }
        return {
            r: c[0],
            g: c[1],
            b: c[2],
            a: 1,
        };
    }

    // Parse #nnnnnnnn
    static hex8ColorToRGBA(str: string) {
        if (str[0] === '#' && str.length === 9) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: parseInt(str.slice(7, 9), 16) / 0xff,
            };
        }
    }

    static hex6ColorToRGBA(str: string) {
        if (str[0] === '#' && str.length === 7) {
            return {
                r: parseInt(str.slice(1, 3), 16),
                g: parseInt(str.slice(3, 5), 16),
                b: parseInt(str.slice(5, 7), 16),
                a: 1,
            };
        }
    }

    // Parse #nnnn
    static hex4ColorToRGBA(str: string) {
        if (str[0] === '#' && str.length === 5) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: parseInt(str[4] + str[4], 16) / 0xff,
            };
        }
    }

    // Parse #nnn
    static hex3ColorToRGBA(str: string) {
        if (str[0] === '#' && str.length === 4) {
            return {
                r: parseInt(str[1] + str[1], 16),
                g: parseInt(str[2] + str[2], 16),
                b: parseInt(str[3] + str[3], 16),
                a: 1,
            };
        }
    }

    // Code adapted from https://github.com/Qix-/color-convert/blob/master/conversions.js#L244
    static hslColorToRGBA(str: string) {
        // Check hsl() format
        if (/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.test(str)) {
            // Extract h, s, l
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, ...hsl] = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(str)!;

            const h = Number(hsl[0]) / 360;
            const s = Number(hsl[1]) / 100;
            const l = Number(hsl[2]) / 100;

            let t2;
            let t3;
            let val;

            if (s === 0) {
                val = l * 255;
                return {
                    r: Math.round(val),
                    g: Math.round(val),
                    b: Math.round(val),
                    a: 1,
                };
            }

            if (l < 0.5) {
                t2 = l * (1 + s);
            } else {
                t2 = l + s - l * s;
            }

            const t1 = 2 * l - t2;

            const rgb = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                t3 = h + (1 / 3) * -(i - 1);
                if (t3 < 0) {
                    t3++;
                }

                if (t3 > 1) {
                    t3--;
                }

                if (6 * t3 < 1) {
                    val = t1 + (t2 - t1) * 6 * t3;
                } else if (2 * t3 < 1) {
                    val = t2;
                } else if (3 * t3 < 2) {
                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                } else {
                    val = t1;
                }

                rgb[i] = val * 255;
            }

            return {
                r: Math.round(rgb[0]),
                g: Math.round(rgb[1]),
                b: Math.round(rgb[2]),
                a: 1,
            };
        }
    }

    /**
     * get RGB components of a color
     * @method
     * @memberof Konva.Util
     * @param {String} color
     * @example
     * // each of the following examples return {r:0, g:0, b:255}
     * var rgb = Konva.Util.getRGB('blue');
     * var rgb = Konva.Util.getRGB('#0000ff');
     * var rgb = Konva.Util.getRGB('rgb(0,0,255)');
     */
    static getRGB(color: string): RGB {
        let rgb;
        // color string
        if (color in COLORS) {
            rgb = COLORS[color as keyof typeof COLORS];
            return {
                r: rgb[0],
                g: rgb[1],
                b: rgb[2],
            };
        } else if (color[0] === HASH) {
            // hex
            return this.hexToRgb(color.substring(1));
        } else if (color.substr(0, 4) === RGB_PAREN) {
            // rgb string
            rgb = RGB_REGEX.exec(color.replace(/ /g, '')) as RegExpExecArray;
            return {
                r: parseInt(rgb[1], 10),
                g: parseInt(rgb[2], 10),
                b: parseInt(rgb[3], 10),
            };
        } else {
            // default
            return {
                r: 0,
                g: 0,
                b: 0,
            };
        }
    }
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d', {willReadFrequently: true})!
const svgPath: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Measure {
    export function measureWidth(text: string, font: string) {
        ctx.font = font;
        const metrics = ctx.measureText(text);
        return metrics.width
    }

    export function measureHeight(font: string, text: string = "我") {
        ctx.font = font;
        const metrics = ctx.measureText(text);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    }

    export function getTotalLength(d: string): number {
        if (!d) {
            return 0
        }
        svgPath.setAttribute('d', d);
        return svgPath.getTotalLength();
    }

    export function getPointAtLength(d: string, len: number): PointLike {
        svgPath.setAttribute('d', d);
        return svgPath.getPointAtLength(len);
    }

    export function calculateVerticalPoint(x1: number, y1: number, x2: number, y2: number, dy: number) {
        // 计算线段的中点坐标
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;

        // 计算线段的长度
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        // 计算单位向量
        const unitX = (x2 - x1) / length;
        const unitY = (y2 - y1) / length;

        // 计算垂直线上的点的坐标
        const x3 = midX - unitY * dy;
        const y3 = midY + unitX * dy;

        return {x: x3, y: y3};
    }

    export function svgPathToTangentPoints(
        {d, x = 0, y = 0, text, font, dx = 0, dy = 0, spacing = 0}: {
            d: string,
            x: number,
            y: number,
            text: string,
            font: string,
            dx: number,
            dy: number,
            spacing: number
        }
    ): TangentPoint[] {
        svgPath.setAttribute('d', d)
        const total = svgPath.getTotalLength();
        const [line] = renderText(text, font, total)
        const points: TangentPoint[] = [];
        let length = 0;
        line.split('').forEach((word, idx) => {
            const w = measureWidth(word, font!);
            length += idx === 0 ? w / 2 + dx : w + spacing;
            const point = svgPath.getPointAtLength(length);
            const nextPoint = svgPath.getPointAtLength(length + 1);

            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
            const _point = calculateVerticalPoint(point.x, point.y, nextPoint.x, nextPoint.y, dy)
            points.push({
                x: _point.x + x,
                y: _point.y + y,
                next: nextPoint,
                w,
                word,
                angle
            })
        })
        return points
    }

    export function genClosePath(d: string, font: string, dy: number = 0, x: number = 0, y: number = 0) {
        svgPath.setAttribute('d', d);
        const total = svgPath.getTotalLength();

        const vPoints: PointLike[] = []
        const points: PointLike[] = [];
        for (let len = 0; len < total; len = len + 1) {
            const point = svgPath.getPointAtLength(len);
            const nextPoint = svgPath.getPointAtLength(len + 1);
            const h = measureHeight(font!);
            const vPoint = calculateVerticalPoint(point.x, point.y, nextPoint.x, nextPoint.y, dy + h)
            points.push({
                x: point.x + x,
                y: point.y + y
            })
            vPoints.push({
                x: vPoint.x + x,
                y: vPoint.y + y
            })
        }
        return points.concat(vPoints.reverse())
    }

    export function getBoundsFromPoints(points: PointLike[]) {
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;
        for (let i = 0; i < points.length; i = i + 1) {
            const point = points[i];
            minX = Math.min(minX, point.x)
            maxX = Math.max(maxX, point.x)
            minY = Math.min(minY, point.y)
            maxY = Math.max(maxY, point.y)
        }
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        }
    }

    export function renderText(text: string, font: string, maxWidth: number) {
        const arr = text.split('');
        const res: string[] = [];
        let tmp = 0;
        let tmpWord = '';
        arr.forEach(word => {
            const wordWidth = measureWidth(word, font)
            tmp = tmp + wordWidth;
            tmpWord = tmpWord + word
            if (tmp + wordWidth > maxWidth) {
                res.push(tmpWord);
                tmp = 0;
                tmpWord = ''
            }
        })
        if (tmpWord) {
            res.push(tmpWord);
        }
        return res
    }
}

export default {
    Color,
    Measure
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number);
    constructor(pointLike: PointLike);
    constructor(xOrPointLike: number | PointLike, y?: number) {
        if (typeof xOrPointLike === 'number') {
            this.x = xOrPointLike;
            this.y = y ?? 0;
        } else {
            this.x = xOrPointLike.x;
            this.y = xOrPointLike.y;
        }
    }

    // 移动点
    move(dx: number, dy: number): Point {
        this.x += dx;
        this.y += dy;
        return this;
    }

    // 加法操作
    add(other: PointLike): Point {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    // 减法操作
    subtract(other: PointLike): Point {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    // 计算两个点之间的距离
    distanceTo(other: PointLike): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 判断两个点是否相等
    equals(other: PointLike): boolean {
        return this.x === other.x && this.y === other.y;
    }

    // 克隆点
    clone(): Point {
        return new Point(this.x, this.y);
    }

    // 计算点到原点的距离
    distanceToOrigin(): number {
        return this.distanceTo(new Point(0, 0));
    }

    // 格式化输出点坐标
    toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    // 静态方法：计算两个点之间的距离
    static distance(p1: PointLike, p2: PointLike): number {
        return new Point(p1).distanceTo(p2);
    }

    // 静态方法：创建一个点数组
    static createPoints(...coords: number[]): Point[] {
        if (coords.length % 2 !== 0) {
            throw new Error("Invalid coordinates");
        }
        const points: Point[] = [];
        for (let i = 0; i < coords.length; i += 2) {
            points.push(new Point(coords[i], coords[i + 1]));
        }
        return points;
    }
}