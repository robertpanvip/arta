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
        const rect2 = new Arta.Rect();
        rect2.style.fillStyle = 'red'
        rect2.x = 400;
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