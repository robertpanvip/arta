import {CanvasEvent, CanvasEventMap, CanvasMouseEvent} from "./EventTarget";
import Group from "./Group";
import Stage from "./Stage";
import {PointLike} from "./interface";

const EventNames = [
    "fullscreenchange",
    "fullscreenerror",
    "abort",
    "animationcancel",
    "animationend",
    "animationiteration",
    "animationstart",
    "auxclick",
    "beforeinput",
    "beforetoggle",
    "blur",
    "cancel",
    "canplay",
    "canplaythrough",
    "change",
    "click",
    "close",
    "compositionend",
    "compositionstart",
    "compositionupdate",
    "contextmenu",
    "copy",
    "cuechange",
    "cut",
    "dblclick",
    "drag",
    "dragend",
    "dragenter",
    "dragleave",
    "dragover",
    "dragstart",
    "drop",
    "durationchange",
    "emptied",
    "ended",
    "error",
    "focus",
    "focusin",
    "focusout",
    "formdata",
    "gotpointercapture",
    "input",
    "invalid",
    "keydown",
    "keypress",
    "keyup",
    "load",
    "loadeddata",
    "loadedmetadata",
    "loadstart",
    "lostpointercapture",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "paste",
    "pause",
    "play",
    "playing",
    "pointercancel",
    "pointerdown",
    "pointerenter",
    "pointerleave",
    "pointermove",
    "pointerout",
    "pointerover",
    "pointerup",
    "progress",
    "ratechange",
    "reset",
    "resize",
    "scroll",
    "scrollend",
    "securitypolicyviolation",
    "seeked",
    "seeking",
    "select",
    "selectionchange",
    "selectstart",
    "slotchange",
    "stalled",
    "submit",
    "suspend",
    "timeupdate",
    "toggle",
    "touchcancel",
    "touchend",
    "touchmove",
    "touchstart",
    "transitioncancel",
    "transitionend",
    "transitionrun",
    "transitionstart",
    "volumechange",
    "waiting",
    "webkitanimationend",
    "webkitanimationiteration",
    "webkitanimationstart",
    "webkittransitionend",
    "wheel",
] as const;

export function getMousePoint(e: Event) {
    if (('x' in e && 'y' in e) || e instanceof TouchEvent) {
        const point = {
            x: 0,
            y: 0
        } as PointLike
        if (!('x' in e && 'y' in e)) {
            if (e instanceof TouchEvent) {
                const touches = e.touches[0];
                point.x = touches.clientX || 0;
                point.y = touches.clientY || 0;
            }
        } else {
            point.x = e.x as number;
            point.y = e.y as number;
        }

        return point
    }
    return null
}

export function trapEvents(canvas: HTMLCanvasElement, that: Stage) {

    function createEvent<K extends keyof CanvasEventMap>(type: K, target: Group | null, native: Event, isCapture: boolean) {
        const event = new CanvasEvent<Group>(type, {bubbles: true});
        event.target = target || null;
        event.eventPhase = isCapture ? Event.CAPTURING_PHASE : Event.BUBBLING_PHASE;
        event.nativeEvent = native;
        const point = getMousePoint(native);
        if (point) {
            (event as CanvasMouseEvent).x = point.x;
            (event as CanvasMouseEvent).y = point.y
        }
        return event as CanvasEventMap<Group>[K];
    }

    const callback = (e: Event, isCapture: boolean) => {

        let group: Group = that;
        const point = getMousePoint(e);
        if (point) {
            const position = that.clientToGraph({
                x: point.x,
                y: point.y,
            });
            group = that.getIntersection(position);
        }
        const evt = createEvent(e.type as keyof CanvasEventMap, group || null, e, isCapture);
        dispatchEvent(evt)
    }
    EventNames.forEach(type => {
        //canvas.addEventListener(type, (e) => callback(e, true), true);
        canvas.addEventListener(type, (e) => callback(e, false), false);
    })

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let previous: Group = that;
    let dragging: Group | null = null;
    let dragStart: Group | null = null;
    const tmp = {
        x: 0,
        y: 0
    }

    function onMouseEvent(e: MouseEvent, isCapture: boolean) {
        const position = that.clientToGraph(e);
        const current = that.getIntersection(position);

        if (current !== previous) {
            dispatchEvent(createEvent("mouseleave", previous, e, isCapture));
            dispatchEvent(createEvent("mouseenter", current, e, isCapture))
        }
        previous = current;
        if (dragStart === current) {
            dragging = current;
            dragging.order = that.order + 1;
            const ev = createEvent("dragstart", current, e, isCapture)
            const scale = dragging.getScale()
            ev.dx = (e.x - tmp.x);
            ev.dy = (e.y - tmp.y);
            dispatchEvent(ev);
        } else if (dragging) {
            const ev = createEvent("drag", dragging, e, isCapture)
            const scale = dragging.getScale()
            ev.dx = (e.x - tmp.x);
            ev.dy = (e.y - tmp.y);
            dispatchEvent(ev);

        }
        tmp.x = e.x;
        tmp.y = e.y;
        dragStart = null;
    }

    function onMouseUpEvent(e: MouseEvent, isCapture: boolean) {
        if (dragging) {
            const ev = createEvent("dragend", dragging, e, isCapture);
            const scale = dragging.getScale()
            ev.dx = (e.x - tmp.x) ;
            ev.dy = (e.y - tmp.y);
            dispatchEvent(ev);
        }
        dragging = null;
        dragStart = null;
        tmp.x = e.x;
        tmp.y = e.y;
    }

    function onMouseDownEvent(e: MouseEvent) {
        const position = that.clientToGraph(e);
        dragStart = that.getIntersection(position);
        tmp.x = e.x;
        tmp.y = e.y;
    }

    canvas.addEventListener('mouseleave', (e) => onMouseEvent(e, true), true)
    document.addEventListener('mousemove', (e) => onMouseEvent(e, true), true)

    document.addEventListener('mouseup', (e) => onMouseUpEvent(e, true), true)
    canvas.addEventListener('mousedown', (e) => onMouseDownEvent(e), true)
}

export function dispatchEvent(event: CanvasEvent<Group>): boolean {
    const paths: Group[] = [];
    let target = event.target;
    if (target) {
        paths.push(target)
    }
    while (target) {
        target = target.parent;
        if (target) {
            paths.push(target)
        }
    }
    const phase = event.eventPhase;
    if (phase !== Event.CAPTURING_PHASE) {
        paths.reverse().forEach(path => {
            if (event.bubbles) {
                path.dispatchEvent(event)
            }
        })
    } else {
        paths.forEach(path => {
            if (event.bubbles) {
                path.dispatchEvent(event)
            }
        })
    }
    return true;
}
