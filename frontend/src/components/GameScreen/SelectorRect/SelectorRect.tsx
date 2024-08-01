import { Layer, Rect } from "react-konva"
import { GAMEBOARD_WIDTH, GAMEBOARD_HEIGHT } from "../constants"
import { useState } from "react"

function pointIsInsideRect(itemX: number, itemY: number, x1: number, x2: number, y1: number, y2: number) {
    let rectLeft: number, rectRight: number, rectTop: number, rectBot: number
    if(x1 < x2) {
        rectLeft = x1;
        rectRight = x2; 
    }
    else {
        rectLeft = x2;
        rectRight = x1;
    }

    if(y1 < y2) {
        rectTop = y1;
        rectBot = y2; 
    }
    else {
        rectTop = y2;
        rectBot = y1;
    }
    return (
        itemX >= rectLeft &&
        itemX <= rectRight &&
        itemY >= rectTop &&
        itemY <= rectBot   
    )
}

interface selectorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function SelectorRect( {gameState, setGameState}: {gameState: any, setGameState: Function}) {
    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
    const [selectorRectInfo, setSelectorRectInfo] = useState<selectorRect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
    const [selectedSum, setSelectedSum] = useState<number>(0)
    
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
                    let sum = 0
                    setGameState(gameState.map((itemRow: any) => {
                        return itemRow.map((item: any) => {
                            if(!item) return item
                            if(!pointIsInsideRect(item.centerX, item.centerY, selectorRectInfo.x, selectorRectInfo.x + selectorRectInfo.width, selectorRectInfo.y, selectorRectInfo.y + selectorRectInfo.height)) {
                                return {
                                    ...item,
                                    selected: false
                                }
                            }
                            sum += item.value
                            return {
                                ...item,
                                selected: true
                            } 
                        })
                    }))
                    setSelectedSum(sum)
                    setSelectorRectInfo({
                        ...selectorRectInfo,
                        width: e.evt.clientX - selectorRectInfo.x,
                        height: e.evt.clientY - selectorRectInfo.y,
                    })
                }}
                onMouseUp={() => {
                    setMouseIsDown(false)
                    setGameState(gameState.map((itemRows: any) => {
                        return itemRows.map((item: any) => {
                            if(!item) return item
                            if(selectedSum === 10 && item.selected) return undefined
                            return {
                                ...item,
                                selected: false
                            }
                        })
                    }))
                    setSelectorRectInfo({
                        ...selectorRectInfo,
                        width: 0,
                        height: 0,
                    })
                }}
                onMouseOut={() => {
                    setMouseIsDown(false)
                    setGameState(gameState.map((itemRows: any) => {
                        return itemRows.map((item: any) => {
                            if(!item) return item
                            if(selectedSum === 10 && item.selected) return undefined
                            return {
                                ...item,
                                selected: false
                            }
                        })
                    }))
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