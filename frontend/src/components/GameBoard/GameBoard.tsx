import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Stage, Rect } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ROWS, COLS, GAMEBOARD_HEIGHT, GAMEBOARD_WIDTH, ITEM_GAP } from './constants';

interface selectorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

function generateItemRows(gameState: number[][]) {
    let result = [];
    for(let i = 0; i < ROWS; i++) {
        result.push(<ItemRow rowNumber={i} itemCount={COLS} itemValues={gameState[i]}/>)
    }
    return result;
}

function calculateCenterGroupPosition() {
    let groupWidth = COLS * ITEM_GAP;
    let groupHeight = ROWS * ITEM_GAP;
    let xOffset = GAMEBOARD_WIDTH/2 - groupWidth/2;
    let yOffset = GAMEBOARD_HEIGHT/2 - groupHeight/2;
    return [xOffset, yOffset];
}

function generateItemValues() {
    let result: number[][] = []
    for(let i = 0; i < ROWS; i++) {
        result.push([])
        for(let j = 0; j < COLS; j++) {
            result[i].push((Math.floor(Math.random() * (10 - 1))) + 1)
        }
    }
    return result
}

export default function GameBoard() {
    const [mouseIsDown, setMouseIsDown] = useState<boolean>(false)
    const [gameState, setGameState] = useState<number[][]>(generateItemValues())
    const [groupX, groupY] = calculateCenterGroupPosition()
    const [selectorRectInfo, setSelectorRectInfo] = useState<selectorRect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    })
    const itemRows = generateItemRows(gameState)

    return (
        <>
            <Stage 
            className='gameBoard' 
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
                if(mouseIsDown) {
                    setSelectorRectInfo({
                        ...selectorRectInfo,
                        width: e.evt.clientX - selectorRectInfo.x,
                        height: e.evt.clientY - selectorRectInfo.y,
                    })
                }
            }}
            onMouseUp={(e) => {
                setMouseIsDown(false)
            }}
            >
               <Layer>
                    <Group x={groupX} y={groupY}>
                        {itemRows}
                    </Group>
                </Layer>
                <Layer>
                    <Rect 
                    x={selectorRectInfo.x} 
                    y={selectorRectInfo.y} 
                    width={selectorRectInfo.width}
                    height={selectorRectInfo.height}
                    fill='blue'
                    />
                </Layer>
 
            </Stage>
        </>
    );
}