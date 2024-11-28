import { Layer, Rect } from "react-konva"
import { useState } from "react"
import ScoreHandler from "./ScoreHandler/ScoreHandler";

function quickSort(arr: number[], length = arr.length - 1, start = 0): number[] {

    if (arr.length < 2) return arr // base case

    const pivot = arr[arr.length - 1]; //pivot value
    const left = [ ];  // left handside array
    const right = [ ]; // right handside array

    while (start < length) {  
        if (arr[start] < pivot){
            left.push(arr[start])
        }
        else {
            right.push(arr[start])
        }
        start++ //  incrementing start value
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

function arraysAreEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    a = quickSort(a)
    b = quickSort(b)

    for(let i = 0; i < a.length; i++) {
        if(a[i] !== b[i]) {
            return false
        }
    }
    return true;
}

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

export default function SelectorRect( { width, height, gameState, setGameState, setScore}: {width: number, height: number, gameState: any, setGameState: Function, setScore: Function | undefined}) {
    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
    const [selectorRectInfo, setSelectorRectInfo] = useState<selectorRect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
    const [selectedSum, setSelectedSum] = useState<number>(0)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const scoreHandler = new ScoreHandler(setScore)
    
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
                width={width}
                height={height}
                onMouseDown={(e) => {
                    setMouseIsDown(true)
                    setSelectorRectInfo({
                        x: e.evt.offsetX,
                        y: e.evt.offsetY,
                        width: 0,
                        height: 0,
                    })
                }}
                onMouseMove={(e) => {
                    if(!mouseIsDown) return
                    let sum = 0
                    let currentSelectedItems: number[] = []
                    let checkedGameState = gameState.map((itemRow: any) => {
                        return itemRow.map((item: any) => {
                            if(!item) {
                                return item
                            }
                            if(!pointIsInsideRect(item.centerX, item.centerY, selectorRectInfo.x, selectorRectInfo.x + selectorRectInfo.width, selectorRectInfo.y, selectorRectInfo.y + selectorRectInfo.height)) {
                                return {
                                    ...item,
                                    selected: false
                                }
                            }
                            currentSelectedItems.push(item.id)
                            sum += item.value
                            return {
                                ...item,
                                selected: true
                            } 
                        })
                    })
                    if(!arraysAreEqual(currentSelectedItems, selectedItems)) {
                        setGameState(checkedGameState)
                    }
                    setSelectedItems(currentSelectedItems)
                    setSelectedSum(sum)
                    setSelectorRectInfo({
                        ...selectorRectInfo,
                        width: e.evt.offsetX - selectorRectInfo.x,
                        height: e.evt.offsetY - selectorRectInfo.y,
                    })
                }}
                onMouseUp={() => {
                    setMouseIsDown(false)
                    setGameState(gameState.map((itemRows: any) => {
                        return itemRows.map((item: any) => {
                            if(!item) return item
                            if(selectedSum === 10 && selectedItems.includes(item.id)) return undefined
                            return {
                                ...item,
                                selected: false
                            }
                        })
                    }))
                    if(selectedSum === 10) {
                        scoreHandler.addScore(selectedItems)
                        setSelectedSum(0);
                        setSelectedItems([]);
                    }
                    setSelectorRectInfo({
                        ...selectorRectInfo,
                        width: 0,
                        height: 0,
                    })
                }}
                onMouseOut={() => {
                    if(!mouseIsDown) return 
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
                    if(selectedSum === 10) {
                        scoreHandler.addScore(selectedItems)
                        setSelectedSum(0);
                        setSelectedItems([]);
                    }
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