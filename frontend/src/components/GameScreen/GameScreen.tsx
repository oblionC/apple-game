import { useEffect, useState, useRef, useMemo } from 'react';
import { Group, Layer, Circle, Rect, Stage, Text } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ITEM_SIZE_MULTIPLIER, ITEM_GAP_MULTIPLIER} from './constants';
import { SelectorRect } from './SelectorRect';

type calculatecCenterGroupPositionParams = {
    width: number, 
    height: number, 
    rows?: number, 
    cols?: number, 
    itemGap?: number, 
    layerWidth?: number, 
    layerHeight?: number 
}

type GameScreenProps = { 
    width: number, 
    height: number, 
    score: number | undefined, 
    setScore: Function | undefined, 
    gameIsActive: boolean, 
    rows: number | undefined, 
    cols: number | undefined, 
    gameScreenRef: any, 
    allowDisplayScore: boolean| undefined
}

function calculateCenterGroupPosition({ width, height, rows, cols, itemGap, layerWidth, layerHeight }: calculatecCenterGroupPositionParams) {
    if(!layerWidth) 
        layerWidth = cols! * itemGap!;
    if(!layerHeight)
        layerHeight = rows! * itemGap!;
    let xOffset = (width - layerWidth) / 2;
    let yOffset = (height - layerHeight) / 2;
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
    if(!gameState) {
        return
    }
    let result = [];
    for(let i = 0; i < rows; i++) {
        result.push(<ItemRow key={i} itemValues={gameState[i]} itemSize={itemSize} />)
    }
    return result;
}

function UnplayableOverlay({ allowDisplayScore, score, width, height}: {allowDisplayScore: boolean | undefined, score: number | undefined, width: number, height: number}) {
    return (
        <>
            <Layer>
                <Rect x={0} y={0} width={width} height={height} /> 
            </Layer>
            {allowDisplayScore && <ScoreDisplay score={score} width={width} height={height} allowDisplayScore={allowDisplayScore} />}
        </>

    )
}

function ScoreDisplay({score, width, height, allowDisplayScore}: { score: number | undefined, width: number, height: number, allowDisplayScore: boolean }) {
    const groupRef = useRef()
    const bgWidth = 300
    const bgHeight = 300
    const [xOffset, yOffset] = calculateCenterGroupPosition({width: width, height: height, layerWidth: bgWidth, layerHeight: bgHeight})

    const comeInAnimation = (node) => {
        node.to({
            y: yOffset,
            duration: 0.2
        })
    }

    useEffect(() => {
        comeInAnimation(groupRef.current)
    }, [])

    return (
        <Layer>
            <Group 
                ref={groupRef}
                x={xOffset} 
                y={-yOffset / 2} 
                width={bgWidth} 
                height={bgHeight}
            >
                <Circle x={bgWidth / 2} y={bgHeight / 2} width={bgWidth} height={bgHeight} fill="#2D3250" opacity={0.7}/>
                <Text text={`Your score: ${score}`} fill="white" fontSize={24} width={bgWidth} height={bgHeight} align="center" verticalAlign="middle" />
            </Group>
        </Layer>
    )
}

export default function GameScreen({ width, height, score, setScore, gameIsActive, rows, cols, gameScreenRef, allowDisplayScore }: GameScreenProps) {
    if(rows === undefined) {
        rows = 15;
    }
    if(cols === undefined) {
        cols = 15;
    }
    const [stageWidth, setStageWidth] = useState(width)
    const [stageHeight, setStageHeight] = useState(height)
    const itemSize = width * ITEM_SIZE_MULTIPLIER
    const itemGap = width * ITEM_GAP_MULTIPLIER
    const [xOffset, yOffset] = useMemo(() => calculateCenterGroupPosition({width, height, rows, cols, itemGap}), [width, height, rows, cols])
    const [gameState, setGameState] = useState<number[][]>()
    const itemRows = useMemo(() => generateItemRows(gameState, itemSize, rows), [gameState, rows])


    useEffect(() => {
        setGameState(generateGameState(xOffset, yOffset, itemSize, itemGap, rows, cols))
    }, [rows, cols])

    useEffect(() => {
        setStageWidth(width)
        setStageHeight(height)
        setGameState(generateGameState(xOffset, yOffset, itemSize, itemGap, rows, cols))
        function handleResize() {
            setStageWidth(gameScreenRef.current.clientWidth)
            setStageHeight(gameScreenRef.current.clientHeight)
        }
        window.addEventListener("resize", handleResize)
    }, [width])

    return (
        <>
            <Stage 
            className='gameBoard' 
            width={stageWidth}
            height={stageHeight}
            >
                <Layer>
                    <Group x={xOffset} y={yOffset}>
                        {itemRows}
                    </Group>
                </Layer>
                <SelectorRect width={stageWidth} height={stageHeight} gameState={gameState} setGameState={setGameState} setScore={setScore} />
                {!gameIsActive && <UnplayableOverlay score={score} allowDisplayScore={allowDisplayScore} width={width} height={height} />}  
            </Stage>
        </>
    );
}