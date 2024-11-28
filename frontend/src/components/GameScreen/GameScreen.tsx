import { useEffect, useState, useRef, useMemo } from 'react';
import { Group, Layer, Circle, Rect, Stage, Text } from 'react-konva';
import { ItemRow } from './ItemRow';
import { ITEM_SIZE_MULTIPLIER, ITEM_GAP_MULTIPLIER} from './constants';
import { SelectorRect } from './SelectorRect';
import generateGameStateValues from '../../utils/generateGameStateValues';

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
    gameStateValues: any, 
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


function generateGameState(gameStateValues: any, xOffset: number, yOffset: number, itemSize: number, itemGap: number, rows: number, cols: number) {
    if(gameStateValues === undefined) return []
    let result: any = []
    let count = 0
    for(let i = 0; i < rows; i++) {
        result.push([])
        for(let j = 0; j < cols; j++) {
            let relativeX = j * itemGap
            let relativeY = i * itemGap
            result[i].push({
                id: count, 
                value: gameStateValues[i][j],
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
            opacity: 1, 
            duration: 0.5 
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
                opacity={0}
            >
                <Circle x={bgWidth / 2} y={bgHeight / 2} width={bgWidth} height={bgHeight} fill="#2D3250" shadowColor="black" shadowBlur={5} shadowOffset={{x: 5, y: 5}} shadowOpacity={0.5} stroke="white" strokeWidth={2}/>
                <Text text={`Your score: ${score}`} fill="white" fontSize={24} width={bgWidth} height={bgHeight} align="center" verticalAlign="middle" />
            </Group>
        </Layer>
    )
}

export default function GameScreen({ gameStateValues, width, height, score, setScore, gameIsActive, rows, cols, gameScreenRef, allowDisplayScore }: GameScreenProps) {
    if(rows === undefined) {
        rows = 15;
    }
    if(cols === undefined) {
        cols = 15;
    }

    const [gameState, setGameState] = useState<number[][]>()
    const [stageWidth, setStageWidth] = useState(width)
    const [stageHeight, setStageHeight] = useState(height)
    const itemSize = width * ITEM_SIZE_MULTIPLIER
    const itemGap = width * ITEM_GAP_MULTIPLIER
    const [xOffset, yOffset] = useMemo(() => calculateCenterGroupPosition({width, height, rows, cols, itemGap}), [width, height, rows, cols])
    const itemRows = useMemo(() => generateItemRows(gameState, itemSize, rows), [gameState, rows])

    useEffect(function changeGameState() {
        let newGameStateValues = gameStateValues;
        if(gameStateValues === undefined)
            newGameStateValues = generateGameStateValues(rows, cols);
        setGameState(generateGameState(newGameStateValues, xOffset, yOffset, itemSize, itemGap, rows, cols))
    }, [gameStateValues])

    useEffect(() => {
        let newGameState = generateGameState(gameStateValues, xOffset, yOffset, itemSize, itemGap, rows, cols)
        setGameState(newGameState)
    }, [rows, cols])

    useEffect(() => {
        if(gameIsActive){
            let newGameState = generateGameState(gameStateValues, xOffset, yOffset, itemSize, itemGap, rows, cols)
            setGameState(newGameState)
        } 
    }, [gameIsActive])

    useEffect(() => {
        setStageWidth(width)
        setStageHeight(height)
        let newGameState = generateGameState(gameStateValues, xOffset, yOffset, itemSize, itemGap, rows, cols)
        setGameState(newGameState)
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