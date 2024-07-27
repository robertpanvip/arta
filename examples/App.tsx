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
        rect.style.fillStyle = 'blue';
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
        rect2.style.width = 800;
        rect2.x = 400;
        rect2.addEventListener('click', (e) => {
            console.time('xxxx')
            rect2.getBoundingClientRect();
            console.timeEnd('xxxx')
            console.log('click', e)
        })
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
        console.log(rect);
        stage.add(rect)
        stage.add(rect2)
    }, [])
    return (
        <div className='box' ref={ref}>

        </div>
    )
}

export default App