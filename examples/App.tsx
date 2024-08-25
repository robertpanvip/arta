import {useEffect, useRef} from 'react'
import './App.scss'
import Arta from '../src'
import {SVGPathData} from 'svg-pathdata'
import Stage from "../src/core/Stage.ts";
import Group from "../src/core/Group.ts";

/*const node = Arta.Group.fromJson({
    type: "xx",
    id: '1',
    children: [
        {
            type: "xx",
            id: '2',
        },
        {
            type: "xx",
            id: '3',
        },
        {
            type: "xx",
            id: '4',
        }
    ]
})
node.children[1].remove()
console.log(node)*/

function App() {
    const ref = useRef<HTMLDivElement>(null)
    const stageRef = useRef<Stage>()
    useEffect(() => {
        stageRef.current = new Arta.Stage({
            container: ref.current!
        })
    }, [])
    const addClickEvent = (item: Group) => {
        stageRef.current!.add(item)
        item.addEventListener('click', () => {
            console.time('click')
            console.time('getAbsolutePosition')
            const point = item.getAbsolutePosition();

            console.timeEnd('getAbsolutePosition')
            console.log(point)
            /*console.time('getBoundingClientRect')
            const rect = item._getBoundingClientRect();
            console.timeEnd('getBoundingClientRect')
            console.log(rect)*/

            console.time('getBBox')
            console.log('xx', item.shape)
            const bbox = item.getGraphBBox();
            console.timeEnd('getBBox')
            console.log(bbox)
            const d = item.shape.toString();
            let m = new DOMMatrix();
            m = m.translate(10, 10);
            const data = new SVGPathData(d).matrix(m.a, m.b, m.c, m.d, m.e, m.f).encode();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const path = new Arta.Path({
                d: data
            })
            console.log(path)
            const box = new Arta.Rect(
                {
                    width: bbox.width,
                    height: bbox.height
                }
            );
            box.x = bbox.x
            box.y = bbox.y
            //stageRef.current!.add(path)
            stageRef.current!.add(box)
            stageRef.current!.flush();
            console.timeEnd('click')
            //console.log('click', e)
        });
    }
    const handleEllipse = () => {
        stageRef.current!.clear()
        const item = new Arta.Ellipse({
            rx: 80,
            ry: 50,
            cx: 200,
            cy: 200
        });
        addClickEvent(item)
    }
    const handleImage = () => {
        stageRef.current!.clear()
        const item = new Arta.Image({
            xlinkHref: 'https://img.zcool.cn/community/0159645d5a2f40a80120695c8d54fc.jpg@1280w_1l_2o_100sh.jpg'
        })
        addClickEvent(item)
    }
    const handleLine = () => {
        stageRef.current!.clear()
        const line = new Arta.Line({
            x1: 50,
            y1: 50,
            x2: 200,
            y2: 200,
            stroke: 'black',
            strokeWidth: 10,
        });
        line.style.lineCap = 'round';
        addClickEvent(line)
    }
    const handlePath = () => {
        stageRef.current!.clear()
        const item = new Arta.Path({
            d: 'M 50 50 L 150 50 L 100 150 Z'
        });
        addClickEvent(item)
    }
    const handlePolygon = () => {
        stageRef.current!.clear()
        const ellipse = new Arta.Polygon({
            points: [{x: 20, y: 20}, {x: 40, y: 25}, {x: 60, y: 40}, {x: 80, y: 120}, {x: 120, y: 140}, {
                x: 200,
                y: 180
            }],
        })
        addClickEvent(ellipse)
    }
    const handleCircle = () => {
        stageRef.current!.clear()
        const item = new Arta.Circle({
            cx: 200,
            cy: 200,
            r: 100
        })
        addClickEvent(item)
    }
    const handleRect = () => {
        stageRef.current!.clear()
        const item = new Arta.Rect();
        item.x = 100
        addClickEvent(item)
    }
    const handleText = () => {
        stageRef.current!.clear()
        const text = new Arta.Text({
            text: "这是我的测试文字这是我的测试文字这是我的测试文字这是我的测试文字这是我的测试文字",
            //dy: 10,
        });
        //text.path = 'M75,20 a1,1 0 0,0 100,0'
        text.style.linePadding = 5;
        text.style.spacing = 0;
        text.style.maxWidth = 50
        addClickEvent(text)
    }
    return (
        <div>
            <div className="btns">
                <button onClick={handleCircle}>Circle</button>
                <button onClick={handleEllipse}>Ellipse</button>
                <button onClick={handleImage}>Image</button>
                <button onClick={handleLine}>Line</button>
                <button onClick={handlePath}>Path</button>
                <button onClick={handlePolygon}>Polygon</button>
                <button onClick={handleRect}>Rect</button>
                <button onClick={handleText}>Text</button>
            </div>

            <div className='box' ref={ref}>

            </div>
        </div>

    )
}

export default App