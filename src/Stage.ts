import Group from "./Group";
import Shape from "./Shape";
import Context from "./Context";

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
        //config.container.appendChild(this.context.offscreen)
        this.context.offscreen.width = canvas.width;
        this.context.offscreen.height = canvas.height;
        this.context.offscreen.style.width = canvas.style.width;
        this.context.offscreen.style.height = canvas.style.height;
        const flush = () => {
            requestAnimationFrame(() => {
                this.render();
                flush();
            })
        }
        flush();

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const tx = (e.x - rect.x) * this.ratio;
            const ty = (e.y - rect.y) * this.ratio;
            const color = this.context.getOffscreenColorByPoint({x: tx, y: ty});
            console.log(color,this.colorMap.get(color));
        })
    }

    isStage(): this is Stage {
        return true
    }

    add(node: Group) {
        this.appendChild(node);
    }

    destroy(node: Group) {
        node.remove();
    }

    render() {
        this.context.canvas.width = this.width * this.ratio; // 实际渲染像素
        this.context.canvas.height = this.height * this.ratio; // 实际渲染像素
        this.context.offscreen.width = this.width * this.ratio;
        this.context.offscreen.height = this.height * this.ratio;
        let next = this.next;
        this.colorMap.clear();
        while (next) {
            if (next instanceof Shape) {
                this.context.save();
                this.context.resetTransform();
                this.context.setTransform(next.getMatrix())
                this.context.current = next;
                this.colorMap.set(next.randomColor, next)
                next.render(this.context);
                this.context.current = null;
                this.context.restore();
            }
            next = next.next;
        }
    }
}