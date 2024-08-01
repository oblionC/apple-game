import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Stage, Rect } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ROWS, COLS, GAMEBOARD_HEIGHT, GAMEBOARD_WIDTH, ITEM_GAP } from './constants';
import { SelectorRect } from './SelectorRect';

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

function generateItemRows(gameState: number[][]) {
    let result = [];
    for(let i = 0; i < ROWS; i++) {
        result.push(<ItemRow rowNumber={i} itemValues={gameState[i]}/>)
    }
    return result;
}

// TODO: Move layers so that the item rows does not rerender everytime you click the screen

export default function GameScreen() {
    const [gameState, setGameState] = useState<number[][]>(generateItemValues())
    const [xOffset, yOffset] = calculateCenterGroupPosition()
    const itemRows = generateItemRows(gameState)

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
                <SelectorRect />
 
            </Stage>
        </>
    );
}