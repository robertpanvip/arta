import {useRef, useEffect} from 'react'
import './App.scss'
import Arta from '../src'

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
    useEffect(() => {
        const stage = new Arta.Stage({
            container: ref.current!
        });
        const rect = new Arta.Rect();
        //rect.style.fillStyle = 'blue';
        rect.x = 0;
        rect.addEventListener('mouseenter', (e) => {
            console.log('rect--mouseenter', e)
        })
        rect.addEventListener('mouseleave', (e) => {
            console.log('rect--mouseleave', e)
        })
        rect.addEventListener('mouseout', (e) => {
            console.log('rect--mouseout', e)
        })

        rect.addEventListener('dragstart', (e) => {
            console.log('dragstart', e)
        })
        rect.addEventListener('drag', (e) => {
            console.log('drag', e)
        })
        rect.addEventListener('dragend', (e) => {
            console.log('dragend', e)
        })
        const rect2 = new Arta.Rect();
        rect2.style.fillStyle = 'red'
        rect2.style.rx = 20;
        rect2.style.width = 400;

        rect2.style.shadowOffsetX = 10;
        rect2.style.shadowOffsetY = 10;
        rect2.style.shadowBlur = 20;
        rect2.style.shadowColor = 'rgba(0, 0, 0, 0.5)';
        rect2.x = 400;
        rect2.addEventListener('click', () => {
            const point = rect2.getAbsolutePosition();
            console.log(point)
            const rect = rect2.getBoundingClientRect();
            console.log(rect)
            //console.log('click', e)
        })
        const text = new Arta.Text({
            text: "这是我的测试文字这是我的测试文字这是我的测试文字这是我的测试文字这是我的测试文字",
            //dy: 10,
        });
        //text.path = 'M75,20 a1,1 0 0,0 100,0'
        text.style.linePadding = 5;
        text.style.spacing = 0;
        text.style.maxWidth = 50

        /*const image = new Arta.Image({
            xlinkHref:'https://img.zcool.cn/community/0159645d5a2f40a80120695c8d54fc.jpg@1280w_1l_2o_100sh.jpg'
        });*/

        const line = new Arta.Line({
            x1: 50,
            y1: 50,
            x2: 200,
            y2: 200,
            stroke: 'black',
            strokeWidth: 10,
        });
        line.style.lineCap = 'round';
        /* const circle = new Arta.Circle({
             cx: 200,
             cy: 200,
             r: 100
         });*/
        /* rect2.addEventListener('mouseenter', (e) =>{
             console.log('rect2--mouseenter',e)
         })
         rect2.addEventListener('mouseleave', (e) =>{
             console.log('rect2--mouseleave',e)
         })*/
        /*rect2.addEventListener('mousemove', (e) =>{
            console.log('rect--mousemove',e)
            //e.stopPropagation();
        })
        stage.addEventListener('mousemove', (e) =>{
            console.log('stage-mousemove',e)
        })*/
        //console.log(rect);
        text.addEventListener('click', () => {
            console.log('xxx', rect2.x)
            rect2.x -= 400;
        })
        //stage.add(text);
        //stage.add(image)
        // stage.add(line)
        //stage.add(circle)
        //stage.add(rect)
        stage.add(rect2);
    }, [])
    return (
        <div className='box' ref={ref}>

        </div>
    )
}

export default App