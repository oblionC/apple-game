import { useEffect, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ROWS, COLS, ITEM_SIZE_MULTIPLIER, ITEM_GAP_MULTIPLIER} from './constants';
import { SelectorRect } from './SelectorRect';

function calculateCenterGroupPosition(width: number, height: number, rows: number, cols: number, itemGap: number) {
    let groupWidth = cols * itemGap;
    let groupHeight = rows * itemGap;
    let xOffset = (width - groupWidth) / 2;
    let yOffset = (height - groupHeight) / 2;
    return [xOffset, yOffset];
}

function generateGameState(xOffset: number, yOffset: number, itemSize: number, itemGap: number, rows: number, cols: number) {
    let result: any = []
    let count = 0
    for(let i = 0; i < rows; i++) {
        result.push([])
        for(let j = 0; j < cols; j++) {
            let relativeX = j * itemGap
            let relativeY = i * itemGap
            result[i].push({
                id: count, 
                value: (Math.floor(Math.random() * (10 - 1))) + 1,
                x: relativeX,
                y: relativeY,
                centerX: xOffset + relativeX + Math.floor(itemSize / 2),
                centerY: yOffset + relativeY + Math.floor(itemSize / 2),
                selected: false
            })
            count++
        }
    }
    return result
}

function generateItemRows(gameState: any, itemSize: number, rows: number) {
    if(!gameState) return
    let result = [];
    for(let i = 0; i < rows; i++) {
        result.push(<ItemRow key={i} itemValues={gameState[i]} itemSize={itemSize} />)
    }
    return result;
}

function UnplayableOverlay({ width, height }: { width: number, height: number}) {
    return (
        <Layer>
           <Rect x={0} y={0} width={width} height={height} /> 
        </Layer>
    )
}

export default function GameScreen({ width, height, setScore, allowPlay, rows, cols }: { width: number, height: number, setScore: Function | undefined, allowPlay: boolean, rows: number | undefined, cols: number | undefined }) {
    if(rows === undefined) {
        rows = 15;
    }
    if(cols === undefined) {
        cols = 15;
    }
    const itemSize = width * ITEM_SIZE_MULTIPLIER
    const itemGap = width * ITEM_GAP_MULTIPLIER
    const [xOffset, yOffset] = calculateCenterGroupPosition(width, height, rows, cols, itemGap)
    const [gameState, setGameState] = useState<number[][]>()
    const itemRows = generateItemRows(gameState, itemSize, rows)

    useEffect(() => {
        setGameState(generateGameState(xOffset, yOffset, itemSize, itemGap, rows, cols))
    }, [width])

    return (
        <>
            <Stage 
            className='gameBoard' 
            width={width}
            height={height}
            >
               <Layer>
                    <Group x={xOffset} y={yOffset}>
                        {itemRows}
                    </Group>
                </Layer>
                <SelectorRect width={width} height={height} gameState={gameState} setGameState={setGameState} setScore={setScore} />
                {!allowPlay && <UnplayableOverlay width={width} height={height} />}
            </Stage>
        </>
    );
}