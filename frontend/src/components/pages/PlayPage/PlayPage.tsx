import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { GameTab } from "../../GameTab";
import { ScoreTab } from "../../ScoreTab";
import getLocalUserInfo from "../../../utils/getLocalUserInfo";
import startTimer from "../../../utils/startTimer";
import stopTimer from "../../../utils/stoptimer";
import generateGameStateValues from "../../../utils/generateGameStateValues";


export default function PlayPage() {
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)

    const [rows, setRows] = rowsState
    const [cols, setCols] = colsState
    const [gameStateValues, setGameStateValues] = useState(generateGameStateValues(rows, cols))
    const gameStateState = useState()
    const gameScreenRef = useRef<any>();
    const timeValueState = useState<number>(30)

    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    const [gameIsActive, setGameIsActive] = useState<boolean>(false)
    const [userPlayedGame, setUserPlayedGame] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    const [allowDisplayScore, setAllowDisplayScore] = useState(false)
    const [optionsTab, setOptionsTab] = useState("Game")
    const timer = useRef<number>()

    useEffect(function changeGameStateValues() {
        if(gameIsActive) {
            setGameStateValues(generateGameStateValues(rows, cols))
        }
    }, [gameIsActive])

    useEffect(function startTimerWhenGameStarts() {
        if(gameIsActive) {
            startTimer(timer, timeValueState[1], setGameIsActive)
        }
        return () => stopTimer(timer)
    }, [gameIsActive])

    useEffect(function submitScore() {
        if(gameIsActive) {
            return
        }
        if(!userPlayedGame) {
            return
        }
        
        var userInfo = getLocalUserInfo()
        if(userInfo !== undefined) {
            var requestOptions = { method: "POST",
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify({
                    score: score,
                    rows: rowsState[0],
                    cols: colsState[0], 
                    timeDuration: timeDurationState[0],
                    userId: userInfo?.userId, 
                }) 
            }
            fetch(import.meta.env.VITE_BACKEND_URL + "/scores/new-score", requestOptions)
        } 
    }, [gameIsActive])

    useEffect(function resetScoreAndTimer() {
        if(gameIsActive) {
            setScore(0)
            setGameStateValues(generateGameStateValues(rows, cols))
            timeValueState[1](timeDurationState[0])
            setUserPlayedGame(true)
        }
    }, [gameIsActive])
    
    useEffect(function setGameScreenDimensions() {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])


    return (
        <>
            <div ref={gameScreenRef} className="w-3/5">
                <GameScreen gameStateValues={gameStateValues} width={width} height={height} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} gameStateState={gameStateState}/>
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[800px] flex flex-col items-center bg-app-primary rounded-lg">
                    <div className="w-full flex flex-row min-h-[50px]">
                        <button className="flex-grow" onClick={() => setOptionsTab("Game")}>Game</button>
                        <button className="flex-grow rounded-tr-lg" onClick={() => setOptionsTab("Score")}>Scores</button>
                    </div>
                    {optionsTab==="Game" && <GameTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeValueState={timeValueState} timeDurationState={timeDurationState} setGameIsActive={setGameIsActive} score={score} setAllowDisplayScore={setAllowDisplayScore} timer={timer} /> }
                    {optionsTab==="Score" && <ScoreTab rowsState={rowsState} colsState={colsState} durationState={timeDurationState} />}
                </div>
            </div>
        </>
    )
}