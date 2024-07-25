import EventTarget from './EventTarget'

export class Group extends EventTarget {
    public dataset = new Set();
    public parent: Group | null = null;
    public next: Group | null = null; //dfs下一个节点
    public previous: Group | null = null;//dfs上一个节点
    public nextSibling: Group | null = null;//dfs 兄弟下一个节点
    public previousSibling: Group | null = null;//dfs 兄弟前节点
    constructor() {
        super();
    }

    /**获取当前子节点的最后一个节点*/
    get last(): Group | null {
        if (this.nextSibling) {
            return this.nextSibling.previous;
        }
        let next = this.next;
        while (next) {
            next = next.next;
        }
        return next;
    }

    get children() {
        const res: Group[] = [];
        let nextSibling = this.nextSibling;
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
        const lastSiblingChild = this.getLastSiblingChild();
        if (lastSiblingChild) {
            lastSiblingChild.after(node)
        } else {
            node.next = this.next;
            node.previous = this;
            this.next = node;
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
}