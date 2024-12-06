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
import { useNavigate } from "react-router-dom";
import { VersusTab } from "../../VersusTab";
import countGameStateScore from "../../../utils/countGameStateScore";

export default function VersusPage() {
    const navigate = useNavigate()
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)
    const gameStateState = useState<number[][]>()

    const scoresRowsState = useState<number>(15)
    const scoresColsState = useState<number>(15)
    const scoresDurationState = useState<number>(30)

    const stagingOppGameStateState = useState()
    const oppGameStateState = useState()
    const oppScreenRef = useRef<any>();
    const oppRowsState = useState(15)
    const oppColsState = useState(15)

    const [oppRows, setOppRows] = oppRowsState
    const [oppCols, setOppCols] = oppColsState

    const [rows, setRows] = rowsState
    const [cols, setCols] = colsState
    const [gameState, setGameState] = gameStateState

    const [stagingOppGameState, setStagingOppGameState] = stagingOppGameStateState

    const [gameStateValues, setGameStateValues] = useState(generateGameStateValues(rows, cols))
    const gameScreenRef = useRef<any>();
    const timeValueState = useState<number>(30)
    const [oppWidth, setOppWidth] = useState(0)
    const [oppHeight, setOppHeight] = useState(0)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [gameIsActive, setGameIsActive] = useState<boolean>(false)
    const [userPlayedGame, setUserPlayedGame] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    const [oppScore, setOppScore] = useState<number>(0)
    const [allowDisplayScore, setAllowDisplayScore] = useState(false)
    const [optionsTab, setOptionsTab] = useState("Game")
    const userInRoomState = useState(false)
    const [userInRoom, setUserInRoom] = userInRoomState 
    const timer = useRef<number>()

    useEffect(function updateOppGameStateInfo() {
        if(!stagingOppGameState) return
        setOppRows(stagingOppGameState.length)
        setOppCols(stagingOppGameState[0].length)
    }, [stagingOppGameState])

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
            setUserInRoom(false)
            console.log("disconneted")
        }
        function onJoinedRoom(m) {
            setUserInRoom(true)
            socket.emit("sendGameState", gameState)
        }
        function onWaitingForRoom() {
        }
        function onOpponentLeftRoom() {
            setUserInRoom(false)
        }
        function onGetOppGameState(state: any) {
            setStagingOppGameState(state)
        }
        function onStartGame() {
            console.log("game started")
            setGameIsActive(true)
            setAllowDisplayScore(true)
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on("joinedRoom", onJoinedRoom);
        socket.on("getOppGameState", onGetOppGameState);
        socket.on("waitingForRoom", onWaitingForRoom);
        socket.on("opponentLeftRoom", onOpponentLeftRoom);
        socket.on("startGame", onStartGame)

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("joinedRoom", onJoinedRoom);
            socket.off("getOppGameState", onGetOppGameState);
            socket.off("waitingForRoom", onWaitingForRoom);
            socket.off("opponentLeftRoom", onOpponentLeftRoom);
        }
    }, [gameState])

    useEffect(function sendGameState() {
        if(userInRoom)
            socket.emit("sendGameState", gameState)
    }, [gameState])

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

        setOppScore(countGameStateScore(oppGameStateState[0]))

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
                <GameScreen gameStateValues={gameStateValues} width={width} height={height} score={score} setScore={setScore} gameIsActive={gameIsActive} rows={rowsState[0]} cols={colsState[0]} gameScreenRef={gameScreenRef} allowDisplayScore={allowDisplayScore} gameStateState={gameStateState} />
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <div className="w-3/4 h-[400px] flex flex-col items-center bg-app-primary overflow-auto rounded-lg">
                    <div className="w-full flex flex-row min-h-[50px]">
                        <button className="flex-grow" onClick={() => setOptionsTab("Game")}>Game</button>
                        <button className="flex-grow" onClick={() => setOptionsTab("Score")}>Scores</button>
                    </div>
                    {optionsTab==="Game" && <VersusTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeValueState={timeValueState} timeDurationState={timeDurationState} setGameIsActive={setGameIsActive} score={score} setAllowDisplayScore={setAllowDisplayScore} timer={timer} userInRoomState={userInRoomState} /> }
                    {optionsTab==="Score" && <ScoreTab rowsState={scoresRowsState} colsState={scoresColsState} durationState={scoresDurationState} />}
                </div>
                <div ref={oppScreenRef} className="w-3/4 h-[400px] flex flex-col items-center ">
                    <GameScreen gameStateValues={gameStateValues} width={oppWidth} height={oppHeight} score={oppScore} setScore={setOppScore} gameIsActive={gameIsActive} rows={oppRows} cols={oppCols} gameScreenRef={oppScreenRef} allowDisplayScore={allowDisplayScore} gameStateState={oppGameStateState} stagingGameState={stagingOppGameState}/>
                </div>
            </div>
        </>
    )
}