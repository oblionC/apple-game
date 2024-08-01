import { Layer, Rect } from "react-konva"
import { GAMEBOARD_WIDTH, GAMEBOARD_HEIGHT } from "../constants"
import { useState } from "react"

interface selectorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function SelectorRect() {
    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
    const [selectorRectInfo, setSelectorRectInfo] = useState<selectorRect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
    return (
        <Layer>
            <Rect 
            x={selectorRectInfo.x} 
            y={selectorRectInfo.y} 
            width={selectorRectInfo.width}
            height={selectorRectInfo.height}
            fill='yellow'
            opacity={0.4}

            />
            <Rect
            x={0}
            y={0}
            width={GAMEBOARD_WIDTH}
            height={GAMEBOARD_HEIGHT}
            onMouseDown={(e) => {
                setMouseIsDown(true)
                setSelectorRectInfo({
                    x: e.evt.clientX,
                    y: e.evt.clientY,
                    width: 0,
                    height: 0,
                })
            }}
            onMouseMove={(e) => {
                if(!mouseIsDown) return
                setSelectorRectInfo({
                    ...selectorRectInfo,
                    width: e.evt.clientX - selectorRectInfo.x,
                    height: e.evt.clientY - selectorRectInfo.y,
                })
            }}
            onMouseUp={(e) => {
                setMouseIsDown(false)
                setSelectorRectInfo({
                    ...selectorRectInfo,
                    width: 0,
                    height: 0,
                })
            }}
            />
        </Layer>
    )
}