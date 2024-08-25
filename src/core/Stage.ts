import Group from "./Group";
import Context, {ContextAttrs} from "./Context";
import {PointLike} from "./interface";
import {trapEvents} from "./Event";
import {PathContext} from "./Path2D";

export type StageConfig = {
    container: HTMLElement
}
export default class Stage extends Group {
    context: Context;
    width: number;
    height: number;
    colorMap = new Map<string, Group>()

    constructor(config: StageConfig) {
        super();
        const canvas = document.createElement('canvas');
        const rect = config.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px';
        const ratio = window.devicePixelRatio || 1;
        this.ratio = ratio;
        canvas.width = rect.width * ratio; // 实际渲染像素
        canvas.height = rect.height * ratio; // 实际渲染像素
        this.scale(ratio);

        config.container.appendChild(canvas);
        this.context = new Context(canvas);
        config.container.appendChild(this.context.offscreen)
        this.context.offscreen.width = canvas.width;
        this.context.offscreen.height = canvas.height;
        this.context.offscreen.style.width = canvas.style.width;
        this.context.offscreen.style.height = canvas.style.height;
        this.flush();
        trapEvents(canvas, this)
    }

    flush = () => {
        requestAnimationFrame(() => {
            this.render();
            this.flush();
        })
    }

    getIntersection(point: PointLike) {
        const color = this.context.getOffscreenColorByPoint(point);
        return this.colorMap.get(color) || this;
    }

    /**
     *鼠标点击点 转换为相对于最近视口元素左上角的图形坐标
     */
    clientToGraph(point: PointLike): PointLike {
        const rect = this.context.canvas.getBoundingClientRect();
        const tx = point.x - rect.x;
        const ty = point.y - rect.y;
        return {
            x: tx * this.ratio,
            y: ty * this.ratio
        }
    }

    isStage(): this is Stage {
        return true
    }

    add(node: Group) {
        this.appendChild(node);
    }

    clear() {
        const children = this.children;
        if (children) {
            children.forEach(child=>{
                this.removeChild(child)
            })
        }
    }

    destroy(node: Group) {
        node.remove();
    }

    getContext() {
        return this.context
    }

    render() {
        const {width, height, ratio, context, colorMap, next} = this;
        // 设置实际渲染像素
        const renderWidth = width * ratio;
        const renderHeight = height * ratio;
        context.canvas.width = renderWidth; // 实际渲染像素
        context.canvas.height = renderHeight; // 实际渲染像素
        context.offscreen.width = renderWidth;
        context.offscreen.height = renderHeight;
        colorMap.clear();
        let order = 0;
        let max = 0;
        const groups: Group[] = [];
        let current = next;
        while (current) {
            order++;
            current.order ??= order;
            max = Math.max(max, current.order);
            groups.push(current);
            current = current.next;
        }
        this.order = max;
        groups.sort((a, b) => a.order - b.order);
        groups.forEach(item => {
            context.save();
            const path = new PathContext();
            item.shape = path;
            context.path = path;
            if (item.ownerViewBox) {
                const {x, y, width, height} = item.ownerViewBox;
                // 定义裁剪路径
                context.beginPath();
                context.rect(x, y, width, height); // 定义一个矩形作为裁剪区域
                context.clip(); // 应用裁剪
            }
            context.current = item;
            context.resetTransform();
            const transform = item.getRenderMatrix()
            context.setTransform(transform)
            ContextAttrs.forEach(attr => {
                const value = item.style[attr] as keyof typeof this.context[typeof attr];
                if (attr === 'fillStyle') {
                    item.style.fillStyle = value || 'transparent'
                }
                if (attr === 'strokeStyle') {
                    item.style.strokeStyle = value || '#000'
                }
                if (item.style[attr]) {
                    context[attr] = value;
                }
            });
            colorMap.set(item.randomColor, item)
            if ('render' in item && typeof item.render === 'function') {
                item.render(context);
            }
            context.current = null;
            context.restore();
        })
    }
}