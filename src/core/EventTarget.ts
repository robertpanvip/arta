import {PointLike} from "./interface.ts";

export interface CanvasEventInit<T> extends CustomEventInit<T> {
}

export class CanvasEvent<D extends EventTarget, N extends Event = Event> extends CustomEvent<null> {
    public target: D | null = null;
    public currentTarget: D | null = null;
    public eventPhase: number = Event.BUBBLING_PHASE;
    public bubbles: boolean = true;
    public nativeEvent: N | null = null

    constructor(type: string, eventInitDict?: CanvasEventInit<null>) {
        super(type, eventInitDict);
    }

    stopPropagation() {
        this.bubbles = false;
    }
}

export interface CanvasEventListener<T extends EventTarget, K extends keyof CanvasEventMap<T>> {
    (evt: (CanvasEventMap<T>)[K]): void;
}

export interface CanvasEventListenerObject<T extends EventTarget, K extends keyof CanvasEventMap<T>> {
    handleEvent(object: (CanvasEventMap<T>)[K]): void;
}

export type CanvasEventListenerOrEventListenerObject<T extends EventTarget, K extends keyof CanvasEventMap<T>> =
    CanvasEventListener<T, K>
    | CanvasEventListenerObject<T, K>

export interface CanvasMouseEvent<T extends EventTarget = EventTarget, N extends Event = Event> extends CanvasEvent<T, N>, PointLike {
    nativeEvent: N | null,
}

export interface CanvasDragEvent<T extends EventTarget = EventTarget, N extends Event = Event> extends CanvasMouseEvent<T, N> {
    dx: number;
    dy: number
}

export interface CanvasEventMap<T extends EventTarget = EventTarget> {
    "click": CanvasMouseEvent<T, MouseEvent>;
    "fullscreenchange": CanvasEvent<T>;
    "fullscreenerror": CanvasEvent<T>;
    "abort": CanvasEvent<T, UIEvent>;
    "animationcancel": CanvasEvent<T, AnimationEvent>;
    "animationend": CanvasEvent<T, AnimationEvent>;
    "animationiteration": CanvasEvent<T, AnimationEvent>;
    "animationstart": CanvasEvent<T, AnimationEvent>;
    "auxclick": CanvasMouseEvent<T, MouseEvent>;
    "beforeinput": CanvasEvent<T, InputEvent>;
    "beforetoggle": CanvasEvent<T>;
    "blur": CanvasEvent<T, FocusEvent>;
    "cancel": CanvasEvent<T>;
    "canplay": CanvasEvent<T>;
    "canplaythrough": CanvasEvent<T>;
    "change": CanvasEvent<T>;
    "close": CanvasEvent<T>;
    "compositionend": CanvasEvent<T, CompositionEvent>;
    "compositionstart": CanvasEvent<T, CompositionEvent>;
    "compositionupdate": CanvasEvent<T, CompositionEvent>;
    "contextmenu": CanvasMouseEvent<T>;
    "copy": CanvasEvent<T, ClipboardEvent>;
    "cuechange": CanvasEvent<T>;
    "cut": CanvasEvent<T, ClipboardEvent>;
    "dblclick": CanvasMouseEvent<T>;
    "drag": CanvasDragEvent<T, DragEvent>;
    "dragend": CanvasDragEvent<T, DragEvent>;
    "dragenter": CanvasDragEvent<T, DragEvent>;
    "dragleave": CanvasDragEvent<T, DragEvent>;
    "dragover": CanvasDragEvent<T, DragEvent>;
    "dragstart": CanvasDragEvent<T, DragEvent>;
    "drop": CanvasEvent<T, DragEvent>;
    "durationchange": CanvasEvent<T>;
    "emptied": CanvasEvent<T>;
    "ended": CanvasEvent<T>;
    "error": CanvasEvent<T, ErrorEvent>;
    "focus": CanvasEvent<T, FocusEvent>;
    "focusin": CanvasEvent<T, FocusEvent>;
    "focusout": CanvasEvent<T, FocusEvent>;
    "formdata": CanvasEvent<T, FormDataEvent>;
    "gotpointercapture": CanvasEvent<T, PointerEvent>;
    "input": CanvasEvent<T>;
    "invalid": CanvasEvent<T>;
    "keydown": CanvasEvent<T, KeyboardEvent>;
    "keypress": CanvasEvent<T, KeyboardEvent>;
    "keyup": CanvasEvent<T, KeyboardEvent>;
    "load": CanvasEvent<T>;
    "loadeddata": CanvasEvent<T>;
    "loadedmetadata": CanvasEvent<T>;
    "loadstart": CanvasEvent<T>;
    "lostpointercapture": CanvasEvent<T, PointerEvent>;
    "mousedown": CanvasMouseEvent<T>;
    "mouseenter": CanvasMouseEvent<T>;
    "mouseleave": CanvasMouseEvent<T>;
    "mousemove": CanvasMouseEvent<T>;
    "mouseout": CanvasMouseEvent<T>;
    "mouseover": CanvasMouseEvent<T>;
    "mouseup": CanvasMouseEvent<T>;
    "paste": CanvasEvent<T, ClipboardEvent>;
    "pause": CanvasEvent<T>;
    "play": CanvasEvent<T>;
    "playing": CanvasEvent<T>;
    "pointercancel": CanvasEvent<T, PointerEvent>;
    "pointerdown": CanvasEvent<T, PointerEvent>;
    "pointerenter": CanvasEvent<T, PointerEvent>;
    "pointerleave": CanvasEvent<T, PointerEvent>;
    "pointermove": CanvasEvent<T, PointerEvent>;
    "pointerout": CanvasEvent<T, PointerEvent>;
    "pointerover": CanvasEvent<T, PointerEvent>;
    "pointerup": CanvasEvent<T, PointerEvent>;
    "progress": CanvasEvent<T, ProgressEvent>;
    "ratechange": CanvasEvent<T>;
    "reset": CanvasEvent<T>;
    "resize": CanvasEvent<T, UIEvent>;
    "scroll": CanvasEvent<T>;
    "scrollend": CanvasEvent<T>;
    "securitypolicyviolation": CanvasEvent<T, SecurityPolicyViolationEvent>;
    "seeked": CanvasEvent<T>;
    "seeking": CanvasEvent<T>;
    "select": CanvasEvent<T>;
    "selectionchange": CanvasEvent<T>;
    "selectstart": CanvasEvent<T>;
    "slotchange": CanvasEvent<T>;
    "stalled": CanvasEvent<T>;
    "submit":  CanvasEvent<T,SubmitEvent>;
    "suspend": CanvasEvent<T>;
    "timeupdate": CanvasEvent<T>;
    "toggle": CanvasEvent<T>;
    "touchcancel": CanvasEvent<T, TouchEvent>;
    "touchend": CanvasEvent<T, TouchEvent>;
    "touchmove": CanvasEvent<T, TouchEvent>;
    "touchstart": CanvasEvent<T, TouchEvent>;
    "transitioncancel": CanvasEvent<T, TransitionEvent>;
    "transitionend": CanvasEvent<T, TransitionEvent>;
    "transitionrun": CanvasEvent<T, TransitionEvent>;
    "transitionstart": CanvasEvent<T, TransitionEvent>;
    "volumechange": CanvasEvent<T>;
    "waiting": CanvasEvent<T>;
    "webkitanimationend": CanvasEvent<T>;
    "webkitanimationiteration": CanvasEvent<T>;
    "webkitanimationstart": CanvasEvent<T>;
    "webkittransitionend": CanvasEvent<T>;
    "wheel": CanvasEvent<T, WheelEvent>;
}


export default class EventTarget extends window.EventTarget {
    addEventListener<K extends keyof CanvasEventMap<typeof this>>(type: K, listener: CanvasEventListenerOrEventListenerObject<typeof this, K> | null, options?: AddEventListenerOptions | boolean) {
        return super.addEventListener(type, listener as unknown as EventListenerOrEventListenerObject, options);
    }
    removeEventListener<K extends keyof CanvasEventMap<typeof this>>(type: K, listener: CanvasEventListenerOrEventListenerObject<typeof this, K> | null, options?: AddEventListenerOptions | boolean) {
        return super.removeEventListener(type, listener as unknown as EventListenerOrEventListenerObject, options);
    }
}