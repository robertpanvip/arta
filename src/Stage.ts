import {Group} from "./Group";
import {CanvasEvent} from "./EventTarget";
import {bus} from "./Bus";
import Shape from "./Shape";
import Context from "./Context";

export default class Stage extends Group {
    context: Context;

    constructor() {
        super();
        const canvas = document.createElement('canvas');
        this.context = new Context(canvas);
        const event = new CanvasEvent('stage::init', {detail: this})
        bus.dispatchEvent(event);
    }

    add(node: Group) {
        this.appendChild(node);
    }

    destroy(node: Group) {
        node.remove();
    }

    render() {
        let next = this.next;
        while (next) {
            if (next instanceof Shape) {
                next.render(this.context);
            }
            next = next.next;
        }
    }
}