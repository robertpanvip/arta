import SVGG from './SVGG';
import SVGRect from './SVGRect';
import SVGLine from './SVGLine';
import Group from "../Group";
import SVGCircle from "./SVGCircle";
import SVGEllipse from "./SVGEllipse";
import SVGPath from "./SVGPath";
import SVGPolygon from "./SVGPolygon";
import CoreText from "../shapes/Text";
import SVGText from "./SVGText";
import SVG from "./SVG";
import {RectangleLike} from "../interface.ts";

type SVGConfig = {
    from: string;
}

function parseRect(str: string): RectangleLike {
    const [x, y, width, height] = str.split(' ').map(Number);
    return {x, y, width, height};
}

export default class SVGParser extends Group {
    static G = SVGG;
    static Rect = SVGRect;
    static Line = SVGLine;

    static Circle = SVGCircle;
    static Ellipse = SVGEllipse;
    static Path = SVGPath;
    static Polygon = SVGPolygon;

    constructor({from}: SVGConfig) {
        super();
        if (from) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(from, "image/svg+xml");
            let viewBox: RectangleLike;
            const loop = (ele: Element, that: Group) => {
                const config: Record<string, unknown> = {}
                //文本
                if (ele.nodeType === 3) {
                    if (that instanceof CoreText) {
                        that.text = ele.nodeValue || ""
                    }
                } else {
                    const attrs = ele.getAttributeNames();

                    attrs.forEach(attrName => {
                        config[attrName] = ele.getAttribute(attrName)
                    })
                }

                let Class;
                if (ele.tagName === 'rect') {
                    Class = SVGRect;
                } else if (ele.tagName === 'line') {
                    Class = SVGLine;
                } else if (ele.tagName === 'circle') {
                    Class = SVGCircle;
                } else if (ele.tagName === 'ellipse') {
                    Class = SVGEllipse;
                } else if (ele.tagName === 'g') {
                    Class = SVGG;
                } else if (ele.tagName === 'path') {
                    Class = SVGPath;
                } else if (ele.tagName === 'polygon') {
                    Class = SVGPolygon;
                } else if (ele.tagName === 'text') {
                    Class = SVGText;
                } else if (ele.tagName === 'svg') {
                    Class = SVG;
                    const str = ele.getAttribute('viewBox');
                    if (str) {
                        viewBox = parseRect(str);
                    }
                }

                if (Class) {
                    const node = new Class(config as any);
                    node.ownerViewBox = viewBox;
                    if (ele.tagName === 'svg') {
                        const _width = ele.getAttribute('width') || "300";
                        const _height = ele.getAttribute('height') || "150";
                        const width = parseFloat(_width);
                        const height = parseFloat(_height);
                        console.log(viewBox.width / width, viewBox.height / height)
                        node.scale(viewBox.width / width, viewBox.height / height);
                    }
                    that.appendChild(node);
                    ele.childNodes.forEach(item => {
                        loop(item as Element, node)
                    })
                }
            }
            doc.childNodes.forEach(item => {
                loop(item as Element, this)
            })
            console.log(doc.childNodes[0]);
        }

    }
}