import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { GameTab } from "../../GameTab";
import getLocalUserInfo from "../../../utils/getLocalUserInfo";
import startTimer from "../../../utils/startTimer";
import stopTimer from "../../../utils/stoptimer";
import { ScoreTab } from "../../ScoreTab";
import { socket } from "../../../socket";
import generateGameStateValues from "../../../utils/generateGameStateValues";
import { AppAuth } from "../../../utils/AppAuth";
import { Button } from "../../Button";
import { useNavigate } from "react-router-dom";


export default function VersusPage() {
    const navigate = useNavigate()
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)

    const scoresRowsState = useState<number>(15)
    const scoresColsState = useState<number>(15)
    const scoresDurationState = useState<number>(30)

    const oppScreenRef = useRef<any>();
    const [rows, setRows] = rowsState
    const [cols, setCols] = colsState
    const [duration, setDuration] = timeDurationState
    const [gameStateValues, setGameStateValues] = useState(generateGameStateValues(rows, cols))
    const [userInfo, setUserInfo] =  useState(AppAuth.getUserInfo())
    const gameScreenRef = useRef<any>();
    const timeValueState = useState<number>(30)
    const [oppWidth, setOppWidth] = useState(0)
    const [oppHeight, setOppHeight] = useState(0)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [msg, setMsg] = useState<String>("")
    const [gameIsActive, setGameIsActive] = useState<boolean>(false)
    const [userPlayedGame, setUserPlayedGame] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    const [allowDisplayScore, setAllowDisplayScore] = useState(false)
    const [optionsTab, setOptionsTab] = useState("Game")
    const timer = useRef<number>()

    useEffect(function sendToLoginPageIfNotLoggedIn() {
        if(AppAuth.getUserInfo() === undefined) {
            navigate("/entry/login")
        }
    }, [])

    useEffect(function initializeSockets() {

        function onConnect () {
            console.log("connected")
        }
        function onDisconnect () {
            console.log("disconneted")
        }
        function onJoinRoom(m: String) {
            setMsg(m)
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on("joinedRoom", onJoinRoom);
        socket.on("waitingForRoom", onJoinRoom);
        socket.on("opponentLeftRoom", onJoinRoom);


        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("joinedRoom", onJoinRoom);
            socket.off("waitingForRoom", onJoinRoom);
            socket.off("opponentLeftRoom", onJoinRoom);
        }
    }, [])


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
            timeValueState[1](timeDurationState[0])
            setUserPlayedGame(true)
        }
    }, [gameIsActive])
    
    useEffect(function setGameScreenDimensions() {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])

    useEffect(function setGameScreenDimensions() {
        setOppWidth(oppScreenRef.current.clientWidth)
        setOppHeight(oppScreenRef.current.scrollHeight)
    }, [])
    return (
        <>
            <div ref={gameScreenRef} className="w-3/5">
                <GameScreen gameStateValues={gameStateValues} width={width} height={height} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} />
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[400px] flex flex-col items-center bg-app-primary overflow-auto">
                    <div className="w-full flex flex-row min-h-[50px]">
                        <button className="flex-grow" onClick={() => setOptionsTab("Game")}>Game</button>
                        <button className="flex-grow" onClick={() => setOptionsTab("Score")}>Scores</button>
                    </div>
                    <div className="w-full flex flex-col items-center">
                        {msg}
                        <Button intent="primary" size="large" onClick={() => {
                            if(userInfo)
                                socket.emit("joinQueue", userInfo, 15, 15, duration)
                        }}>Play</Button>
                    </div>
                    {optionsTab==="Game" && <GameTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeValueState={timeValueState} timeDurationState={timeDurationState} setGameIsActive={setGameIsActive} score={score} setAllowDisplayScore={setAllowDisplayScore} timer={timer} /> }
                    {optionsTab==="Score" && <ScoreTab rowsState={scoresRowsState} colsState={scoresColsState} durationState={scoresDurationState} />}
                </div>
                <div ref={oppScreenRef} className="w-3/4 h-[400px] flex flex-col items-center ">
                    <GameScreen gameStateValues={gameStateValues} width={oppWidth} height={oppHeight} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} />
                </div>
            </div>
        </>
    )
}