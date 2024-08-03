import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Stage, Rect } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ROWS, COLS, GAMEBOARD_HEIGHT, GAMEBOARD_WIDTH, ITEM_GAP, ITEM_SIZE} from './constants';
import { SelectorRect } from './SelectorRect';

function calculateCenterGroupPosition() {
    let groupWidth = COLS * ITEM_GAP;
    let groupHeight = ROWS * ITEM_GAP;
    let xOffset = GAMEBOARD_WIDTH/2 - groupWidth/2;
    let yOffset = GAMEBOARD_HEIGHT/2 - groupHeight/2;
    return [xOffset, yOffset];
}

function generateGameState(xOffset: number, yOffset: number) {
    let result: any = []
    let count = 0
    for(let i = 0; i < ROWS; i++) {
        result.push([])
        for(let j = 0; j < COLS; j++) {
            let relativeX = j * ITEM_GAP
            let relativeY = i * ITEM_GAP
            result[i].push({
                id: count, 
                value: (Math.floor(Math.random() * (10 - 1))) + 1,
                x: relativeX,
                y: relativeY,
                centerX: xOffset + relativeX + Math.floor(ITEM_SIZE / 2),
                centerY: yOffset + relativeY + Math.floor(ITEM_SIZE / 2),
                selected: false
            })
            count++
        }
    }
    return result
}

function generateItemRows(gameState: any) {
    let result = [];
    for(let i = 0; i < ROWS; i++) {
        result.push(<ItemRow key={i} itemValues={gameState[i]}/>)
    }
    return result;
}


export default function GameScreen() {
    const [xOffset, yOffset] = calculateCenterGroupPosition()
    const [gameState, setGameState] = useState<number[][]>(generateGameState(xOffset, yOffset))
    const itemRows = generateItemRows(gameState)
    console.log("updated")

    return (
        <>
            <Stage 
            className='gameBoard' 
            width={GAMEBOARD_WIDTH}
            height={GAMEBOARD_HEIGHT}
            >
               <Layer>
                    <Group x={xOffset} y={yOffset}>
                        {itemRows}
                    </Group>
                </Layer>
                <SelectorRect gameState={gameState} setGameState={setGameState} />
            </Stage>
        </>
    );
}