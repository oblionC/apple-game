import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { GameTab } from "./GameTab";


export default function PlayPage() {
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)
    const gameScreenRef = useRef<any>();
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [gameIsActive, setGameIsActive] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    const [allowDisplayScore, setAllowDisplayScore] = useState(false)

    useEffect(function resetScore() {
        if(gameIsActive) {
            setScore(0)
        }
    }, [gameIsActive])
    
    useEffect(function setGameScreenDimensions() {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])

    return (
        <>
            <div ref={gameScreenRef} className="w-3/5">
                <GameScreen width={width} height={height} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} />
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[800px] flex flex-col items-center bg-app-primary">
                    <div className="w-full flex flex-row h-[50px]">
                        <button className="flex-grow">Game</button>
                        <button className="flex-grow">Scores</button>
                    </div>
                    <GameTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeDurationState={timeDurationState} setGameIsActive={setGameIsActive} score={score} setAllowDisplayScore={setAllowDisplayScore} /> 
                </div>
            </div>
        </>
    )
}