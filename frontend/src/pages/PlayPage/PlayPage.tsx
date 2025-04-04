import { GameScreen } from "../../components/GameScreen"
import { useEffect, useRef, useState } from "react";
import { GameTab } from "../../components/GameTab";
import { ScoreTab } from "../../components/ScoreTab";
import getLocalUserInfo from "../../components/../utils/getLocalUserInfo";
import startTimer from "../../components/../utils/startTimer";
import stopTimer from "../../components/../utils/stoptimer";
import generateGameStateValues from "../../components/../utils/generateGameStateValues";
import { AppAuth } from "../../components/../utils/AppAuth";


export default function PlayPage() {
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)
    const targetSumState = useState<number>(10)

    const [gameStateValues, setGameStateValues] = useState(generateGameStateValues(rowsState[0], colsState[0]))
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
    const userInfo = AppAuth.getUserInfo()

    useEffect(function changeGameStateValues() {
        if(gameIsActive) {
            setGameStateValues(generateGameStateValues(rowsState[0], colsState[0]))
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
            const requestHeaders: HeadersInit = new Headers() 
            requestHeaders.set("Content-Type", "application/json")
            requestHeaders.set("X-Access-Token", AppAuth.getToken())
            var requestOptions: RequestInit = { method: "POST",
                headers: requestHeaders, 
                body: JSON.stringify({
                    gameState: gameStateState[0],
                    score: score,
                    rows: rowsState[0],
                    cols: colsState[0], 
                    timeDuration: timeDurationState[0],
                    userId: userInfo?.userId, 
                    username: userInfo?.username,
                }),
            }
            console.log(requestOptions)
            fetch(import.meta.env.VITE_BACKEND_URL + "/scores/new-score", requestOptions)
        } 
    }, [gameIsActive])

    useEffect(function resetScoreAndTimer() {
        if(gameIsActive) {
            setScore(0)
            setGameStateValues(generateGameStateValues(rowsState[0], colsState[0]))
            timeValueState[1](timeDurationState[0])
            setUserPlayedGame(true)
        }
    }, [gameIsActive])
    
    useEffect(function setGameScreenDimensions() {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])


    return (
        <div className="w-full grid grid-cols-12">
            <div ref={gameScreenRef} className="md:col-span-7 col-span-12">
                <GameScreen gameStateValues={gameStateValues} width={width} height={height} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} targetSum={targetSumState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} gameStateState={gameStateState}/>
            </div>
            <div className="md:col-span-5 col-span-12 grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[800px] flex flex-col items-center bg-app-primary rounded-lg">
                    <div className="w-full flex flex-row min-h-[50px]">
                        <button className={`flex-grow border-${optionsTab === "Game"? "transparent": "white"}`} onClick={() => setOptionsTab("Game")}>Game</button>
                        <button className="flex-grow" onClick={() => setOptionsTab("Score")}>Scores</button>
                    </div>
                    {optionsTab==="Game" && <GameTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeValueState={timeValueState} targetSumState={targetSumState} timeDurationState={timeDurationState} setGameIsActive={setGameIsActive} score={score} setAllowDisplayScore={setAllowDisplayScore} /> }
                    {optionsTab==="Score" && <ScoreTab userInfo={userInfo} rowsState={rowsState} colsState={colsState} durationState={timeDurationState} />}
                </div>
            </div>
        </div>
    )
}