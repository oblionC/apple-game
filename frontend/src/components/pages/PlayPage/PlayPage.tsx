import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { GameTab } from "./GameTab";


export default function PlayPage() {
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const gameScreenRef = useRef<any>();
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [gameIsActive, setGameIsActive] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    useEffect(() => {

    }, [rowsState[0], colsState[0]])
    
    useEffect(() => {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])

    return (
        <>
            <div ref={gameScreenRef} className="w-3/5">
                <GameScreen width={width} height={height} setScore={setScore} allowPlay={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} />
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[800px] flex flex-col items-center bg-app-primary">
                    <div className="w-full flex flex-row h-[50px]">
                        <button className="flex-grow">Game</button>
                        <button className="flex-grow">Scores</button>
                    </div>
                    <GameTab rowsState={rowsState} colsState={colsState} setGameIsActive={setGameIsActive} score={score} /> 
                </div>
            </div>
        </>
    )
}