import { useRef, useState } from 'react';
import { Group, Layer, Stage } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ROWS, COLS, ITEM_SIZE_MULTIPLIER, ITEM_GAP_MULTIPLIER} from './constants';
import { SelectorRect } from './SelectorRect';

function calculateCenterGroupPosition(width: number, height: number, itemGap: number) {
    let groupWidth = COLS * itemGap;
    let groupHeight = ROWS * itemGap;
    let xOffset = (width/2 - groupWidth/2) / 2;
    let yOffset = (height/2 - groupHeight/2) / 1.3;
    return [xOffset, yOffset];
}

function generateGameState(xOffset: number, yOffset: number, itemSize: number, itemGap: number) {
    let result: any = []
    let count = 0
    for(let i = 0; i < ROWS; i++) {
        result.push([])
        for(let j = 0; j < COLS; j++) {
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

function generateItemRows(gameState: any, itemSize: number) {
    let result = [];
    for(let i = 0; i < ROWS; i++) {
        result.push(<ItemRow key={i} itemValues={gameState[i]} itemSize={itemSize} />)
    }
    return result;
}


export default function GameScreen({ width, height }: { width: number, height: number }) {
    const canvasRef = useRef<any>()
    console.log(canvasRef)
    const itemSize = width * ITEM_SIZE_MULTIPLIER
    const itemGap = width * ITEM_GAP_MULTIPLIER
    const [xOffset, yOffset] = calculateCenterGroupPosition(width, height, itemSize)
    const [gameState, setGameState] = useState<number[][]>(generateGameState(xOffset, yOffset, itemSize, itemGap))
    const itemRows = generateItemRows(gameState, itemSize)

    return (
        <>
            <Stage 
            ref={canvasRef}
            className='gameBoard' 
            width={width}
            height={height}
            >
               <Layer>
                    <Group x={xOffset} y={yOffset}>
                        {itemRows}
                    </Group>
                </Layer>
                <SelectorRect width={width} height={height} gameState={gameState} setGameState={setGameState} />
            </Stage>
        </>
    );
}