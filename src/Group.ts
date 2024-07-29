import Transform from "./Transform";
import {CanvasStyle, PointLike, RectangleLike} from "./interface";
import type Stage from "./Stage";
import {Color} from "./Util";

type GroupJson = {
    type: string;
    id: string;
    children?: GroupJson[]
}
export type GroupConfig = {
    id?: string;
    draggable?: boolean;
    x?: number,
    y?: number
}
export default class Group extends Transform {
    public randomColor: string = Color.getRandomColor();
    public id?: string;
    public order: number = 0;
    public dataset = new Set();
    public parent: Group | null = null;
    public next: Group | null = null; //dfs下一个节点
    public previous: Group | null = null;//dfs上一个节点
    public nextSibling: Group | null = null;//dfs 兄弟下一个节点
    public previousSibling: Group | null = null;//dfs 兄弟前节点
    public draggable: boolean = true;

    public ownerViewBox?:RectangleLike

    style: Partial<CanvasStyle> = {
        strokeStyle: '#000000'
    }

    constructor(config: Partial<GroupConfig> = {}) {
        super();
        this.id = config.id;
        this.draggable = config.draggable || true;
        this.x = config.x || 0;
        this.y = config.y || 0;
    }


    get x(): number {
        return this.matrix.e
    }

    set x(x: number) {
        const matrix = this.getMatrix();
        matrix.e = x || 0;
        this.setMatrix(matrix);
    }

    get y(): number {
        return this.matrix.f
    }

    set y(y: number) {
        const matrix = this.getMatrix();
        matrix.f = y || 0;
        this.setMatrix(matrix);
    }


    getBoundingClientRect(): RectangleLike {
        const stage = this.getStage();
        const color = Color.colorToRGBA(this.randomColor);
        return stage?.context.getBoundingClientRect(color!) || {width: 0, height: 0, x: 0, y: 0}
    }

    isStage(): this is Stage {
        return false;
    }

    getRenderMatrix() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let temp: Group = this;
        const arr: Group[] = [this];
        while (temp.parent) {
            arr.push(temp.parent)
            temp = temp.parent;
        }
        return arr.reverse().reduce((p, c) => {
            return p.multiply(c.getMatrix())
        }, new DOMMatrix())
    }

    getRelativePosition(): PointLike {
        return {
            x: this.x,
            y: this.y
        }
    }

    getAbsolutePosition(): PointLike {
        const stage = this.getStage();
        if (!stage) {
            return {x: 0, y: 0}
        }
        const matrix = this.getRenderMatrix();
        const scale = stage.getScale();
        // 变换后的顶点坐标
        return {
            x: matrix.e / scale.sx,
            y: matrix.f / scale.sy,
        };
    }

    getStage(): null | Stage {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let parent: Group | null = this;
        while (parent) {
            if (parent.isStage()) {
                break;
            }
            parent = parent.parent;
        }

        return parent
    }

    /**获取当前子节点的最后一个节点*/
    get last(): Group | null {
        if (this.nextSibling) {
            return this.nextSibling.previous;
        }
        let next = this.next;
        while (next) {
            if (next.next === null) {
                break;
            }
            next = next.next;
        }
        return next || this;
    }

    get children() {
        const res: Group[] = [];
        let nextSibling = this.next;
        while (nextSibling && nextSibling.parent === this) {
            res.push(nextSibling);
            nextSibling = nextSibling.nextSibling;
        }
        return res
    }

    getFirstChild() {
        const next = this.next;
        if (next && next != this.nextSibling) {
            return next
        }
        return null;
    }

    getLastSiblingChild() {
        let child = this.getFirstChild();
        while (child) {
            if (child.nextSibling) {
                child = child.nextSibling;
            } else {
                break
            }
        }
        return child;
    }

    //readonly #children = new Children(this);
    remove() {
        if (this.previous) {
            this.previous.next = this.next;
        }
        if (this.next) {
            this.next.previous = this.previous;
        }
        if (this.previousSibling) {
            this.previousSibling.nextSibling = this.nextSibling;
        }
        if (this.nextSibling) {
            this.nextSibling.previousSibling = this.previousSibling;
        }

    }

    before<T extends Group>(newNode: T) {
        newNode.parent = this.parent;
        const previous = this.previous;
        newNode.previous = previous;
        if (previous) {
            previous.next = newNode;
        }
        const last = newNode.last;
        if (last) {
            last.next = this;
        }
        this.previous = last;
        const previousSibling = this.previousSibling
        //当前previous=新节点
        this.previousSibling = newNode;
        newNode.nextSibling = this;
        if (previousSibling) {
            //前兄弟的后兄弟指向 移除的的前兄弟
            previousSibling.nextSibling = newNode;
        }
        newNode.previousSibling = previousSibling;
    }

    after<T extends Group>(newNode: T) {
        newNode.parent = this.parent;
        const previous = this.last;
        newNode.previous = previous;
        if (previous) {
            previous.next = newNode;
        }

        const nextSibling = this.nextSibling
        //当前next=新节点
        this.nextSibling = newNode;
        if (nextSibling) {
            //后一个兄弟的 前兄弟 =移除的 前兄弟
            nextSibling.previousSibling = newNode;
            const last = newNode.last
            //后一个兄弟的 previous =移除的 previous
            nextSibling.previous = last;
            if (last) {
                last.next = nextSibling;
            }
        }
        newNode.nextSibling = nextSibling;

        newNode.previousSibling = this;

    }

    replaceWith<T extends Group>(node: T): T {
        node.parent = this.parent;
        node.previous = this.previous;
        node.next = this.next;
        node.nextSibling = this.nextSibling;
        node.previousSibling = this.previousSibling;
        if (this.previous) {
            this.previous.next = node;
        }
        if (this.next) {
            this.next.previous = node;
        }
        if (this.previousSibling) {
            this.previousSibling.nextSibling = node;
        }
        if (this.nextSibling) {
            this.nextSibling.previousSibling = node;
        }
        return node
    }

    appendChild<T extends Group>(node: T): T {
        node.parent = this;
        const lastSiblingChild = this.getLastSiblingChild();
        if (lastSiblingChild) {
            lastSiblingChild.after(node)
        } else {
            this.next = node;
            node.previous = this;
            node.nextSibling = null;
            node.previousSibling = null;
        }
        return node
    }

    /* clone(deep?: boolean): Group {
         return this;
     }*/

    insertBefore<T extends Group>(newNode: T, referenceNode: Group | null): T {
        if (referenceNode) {
            referenceNode.before(newNode)
        } else {
            this.appendChild(newNode)
        }
        return newNode;
    }

    removeChild<T extends Group>(child: T) {
        child.remove();
        return child;
    }

    replaceChild<T extends Group>(newChild: T, oldChild: T): T {
        oldChild.replaceWith(newChild);
        return newChild
    }

    toJson(): GroupJson {
        return {
            id: this.id || "",
            type: 'group',
            children: this.children.map(child => child.toJson())
        }
    }

    static fromJson(json: GroupJson) {
        const parent = new Group({id: json.id});
        let current: Group | null = null;
        const loop = (array: GroupJson[], parent: Group | null, previous: Group | null) => {
            let previousSibling: Group | null = null;
            return array.forEach(item => {
                current = new Group({id: item.id});
                current.previous = previous;
                if (previous) {
                    previous.next = current;
                }
                current.parent = parent;
                loop(item.children || [], current, current);
                previous = current;
                current.previousSibling = previousSibling;
                if (previousSibling) {
                    previousSibling.nextSibling = current;
                }
                previousSibling = current;
            })
        }
        loop(json.children || [], parent, parent);
        return parent;
    }
}