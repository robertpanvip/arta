import Shape from "../core/Shape.ts";
import {Measure} from "../core/Util.ts";
import Context from "../core/Context.ts";
import {CanvasStyle, PointLike, TangentPoint} from "../core/interface.ts";

export interface TextStyle extends CanvasStyle {
    cursor?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    spacing?: number;
    overflow?: 'default' | "hidden" | 'ellipsis';//hidden。这个关键字会在内容区域隐藏文本 ellipsis 这个关键字会用一个省略号（'…'）来表示被截断的文本。这个省略号被添加在内容区域中，因此会减少显示的文本。如果空间太小以至于连省略号都容纳不下，那么这个省略号也会被截断
    wrap?: 'wrap' | 'nowrap'
    color?: string | CanvasGradient | CanvasPattern;
    borderColor?: string;
    linePadding?: number;
    maxWidth?: number;
    dx?: number;
    dy?: number
}

export type TextConfig = {
    x?: number,
    y?: number,
    dx?: number;
    dy?: number;
    text?: string;
    path?: string;
    style?: Partial<TextStyle>
}

const defaultStyle = {
    color: 'black',
    textBaseline: 'top' as const,
    textAlign: 'left' as const,
    linePadding: 5,
    wrap: 'wrap' as const,
    overflow: 'ellipsis' as const
}


interface PrivateScope {
    path: string,
    font: string,
    dy: number,
    res: PointLike[]
}

interface Private2Scope {
    d: string,
    text: string,
    font: string,
    dx: number,
    dy: number,
    spacing: number
    res: TangentPoint[];
}

const cache1 = new WeakMap<Text, PrivateScope>()
const cache2 = new WeakMap<Text, Private2Scope>()

class Text extends Shape {

    name: string = "Text"

    public text: string = "";
    public path: string = ""

    public style: Partial<TextStyle> = {...defaultStyle};

    constructor(
        {
            x,
            y,
            dx,
            dy,
            text,
            path,
            style = {...defaultStyle}
        }: TextConfig = {
            x: 0,
            y: 0,
            text: '我',
            path: '',
            style: {...defaultStyle}
        }) {
        super();
        this.x = x || 0;
        this.y = y || 0;
        this.text = text || "";
        this.path = path || '';
        this.style = {
            ...style,
            dx: dx || 0,
            dy: dy || 0,
            strokeStyle: 'black',
            fillStyle: style?.color || 'black'
        };
        this.getClosePathPoints();
        this.getWordPoints();
    }

    get maxWidth() {
        return this.style.maxWidth || Measure.getTotalLength(this.path)
    }

    getClosePathPoints() {
        const dy = this.style.dy || 0;
        const cache = cache1.get(this);
        const dependencies = {
            path: this.path,
            font: this.getFont(),
            dy,
        }
        if (cache && cache.path === this.path && cache.font === this.getFont() && cache.dy === (dy)) {
            return cache.res;
        }
        const res = Measure.genClosePath(this.path, this.getFont()!, dy, 0, 0)
        cache1.set(this, {...dependencies, res})
        return res
    }

    getWordPoints() {
        const dy = this.style.dy || 0;
        const dx = this.style.dx || 0;
        const cache = cache2.get(this);
        const dependencies = {
            d: this.path,
            text: this.text,
            font: this.getFont()!,
            dx,
            dy,
            spacing: this.style.spacing || 0
        }
        if (cache
            && cache.d === this.path
            && cache.text === this.text
            && cache.font === this.getFont()
            && cache.dy === dy
            && cache.dx === dx
            && cache.spacing === (this.style.spacing || 0)
        ) {
            return cache.res;
        }
        const res = this.path ? Measure.svgPathToTangentPoints({
            d: this.path,
            x: 0,
            y: 0,
            text: this.text,
            font: this.getFont()!,
            dx: dx,
            dy: dy,
            spacing: this.style.spacing || 0
        }) : [];
        cache2.set(this, {...dependencies, res})
        return res
    }

    get calcTexts() {
        const {wrap, overflow} = this.style;
        const font = this.getFont()
        if (!this.maxWidth) {
            return [this.text]
        }
        if (wrap === 'wrap') {
            return Measure.renderText(this.text, font!, this.maxWidth)
        }
        if (overflow === 'hidden') {
            const texts = Measure.renderText(this.text, font!, this.maxWidth);
            return [texts[0]]
        }
        if (overflow === 'ellipsis') {
            const texts = Measure.renderText(this.text, font!, this.maxWidth)
            if (texts.length >= 2) {
                const line = texts[0];
                const arr = line.split('')
                const ellipsisWidth = Measure.measureWidth(`…`, font!)
                if (ellipsisWidth > this.maxWidth) {
                    return []
                }
                while (Measure.measureWidth(`${arr.join('')}…`, font!) > this.maxWidth) {
                    arr.pop()
                }
                return [`${arr.join('')}…`]
            }
        }
        return [this.text]
    }

    getBoundingClientRect() {
        const points = this.getClosePathPoints()
        if (points.length !== 0) {
            return Measure.getBoundsFromPoints(points)
        }
        const font = this.getFont()
        const h = Measure.measureHeight(font);
        const sizes = this.calcTexts.map((text) => {
            return {
                w: Measure.measureWidth(text, font),
                h: h + (this.style.linePadding || 0)! * 2,
            }
        })
        return {
            x: this.x,
            y: this.y,
            width: Math.max(...sizes.map(size => size.w)),
            height: sizes.length * (h + (this.style.linePadding || 0)! * 2)
        }
    }

    render(ctx: Context) {
        const font = this.getFont();
        ctx.save();
        const linePadding = this.style.linePadding || 0;
        if (this.path) {
            // 绘制围绕路径的文字
            ctx.textAlign = this.style.textAlign || "center";
            ctx.textBaseline = this.style.textBaseline || "top";
            //ctx.stroke(new Path2D(this.path))
            const points = this.getWordPoints() || []
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                ctx.save();
                // 将坐标原点移到路径上的点
                ctx.translate(point.x, point.y);
                // 旋转坐标系
                ctx.rotate(point.angle);
                // 绘制文字
                ctx.fillText(point.word, 0, 0);

                ctx.restore();
            }
        } else {
            this.calcTexts.forEach((text, index) => {
                const h = Measure.measureHeight(font, text);
                ctx!.fillText(text, this.style.dx || 0, h * index + linePadding! * (index * 2 + 1))
            })
        }
        ctx.restore();
        const path = this.getShape();
        const paths = Array.isArray(path) ? path : [path];
        ctx.fillStyle = 'transparent'
        paths.forEach(path => {
            ctx.fill(path)
        });
        ctx.fillStyle = this.style.borderColor || this.style.strokeStyle || ""
        if (ctx.fillStyle) {
            paths.forEach(path => {
                ctx.stroke(path)
            })
        }
    }

    getFont() {
        if (this.style.font) {
            return this.style.font
        }
        const stage = this.getStage()
        if (stage) {
            const ctx = stage.getContext();
            return ctx.font;
        }
        return ""
    }

    getShape(): Path2D[] {
        const font = this.getFont()
        const {x, y} = {x: 0, y: 0};
        if (this.path) {
            const closePathPoints = this.getClosePathPoints() || []
            const path = new Path2D();
            for (let i = 0; i < closePathPoints.length; i++) {
                const point = closePathPoints[i];
                if (i === 0) {
                    path.moveTo(point.x, point.y);
                } else {
                    path.lineTo(point.x, point.y);
                }
            }
            path.closePath();
            return [path]
        }
        return this.calcTexts.flatMap((item, index) => {
            const h = Measure.measureHeight(font, item);
            const height = (h + (this.style.linePadding || 0) * 2);
            const width = Measure.measureWidth(item, font)
            const path = new Path2D();
            const cornerRadius = 0;
            const _y = y + height * index;
            // 从左上角开始绘制矩形路径
            path.moveTo(x + cornerRadius, _y);
            path.lineTo(x + width - cornerRadius, _y);
            path.arcTo(x + width, _y, x + width, _y + cornerRadius, cornerRadius);
            path.lineTo(x + width, _y + height - cornerRadius);
            path.arcTo(x + width, _y + height, x + width - cornerRadius, _y + height, cornerRadius);
            path.lineTo(x + cornerRadius, _y + height);
            path.arcTo(x, _y + height, x, _y + height - cornerRadius, cornerRadius);
            path.lineTo(x, _y + cornerRadius);
            path.arcTo(x, _y, x + cornerRadius, _y, cornerRadius);
            path.closePath();
            return path
        })
    }
}

export default Text