import type {PointLike} from "../core/interface.ts";
import Path from "./Path";
import Shape from "../core/Shape.ts";
import Path2D from '../core/Path2D.ts'

export type PolygonOptions = {
    points: readonly PointLike[],
    close: boolean,//是否闭合
}

type PrivateScope = NonNullable<unknown> & PolygonOptions

const getPathStrFromPoints = (points: readonly PointLike[], close: boolean) => {
    return points.map((p, index) => `${index === 0 ? "M" : "L"}${p.x},${p.y} `).join('') + (close ? 'Z' : '')
}

const vm = new WeakMap<Shape, PrivateScope>()

class Polygon extends Path {

    constructor(options: Partial<PolygonOptions> = {points: [], close: false}) {
        const _options = {points: [], close: false, ...options}
        super({
            d: getPathStrFromPoints(_options.points, _options.close)
        });
        vm.set(this, {..._options})
    }

    get close() {
        return vm.get(this)!.close
    }

    set close(close) {
        vm.get(this)!.close = close;
        const d = getPathStrFromPoints(this.points, close)
        this.path = new Path2D(d)
    }

    get points() {
        return vm.get(this)!.points
    }

    set points(points) {
        vm.get(this)!.points = points;
        const d = getPathStrFromPoints(points, this.close);
        this.path = new Path2D(d)
    }

}

export default Polygon