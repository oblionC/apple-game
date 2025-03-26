import { GameScreen } from "../../components/GameScreen"
import { useEffect, useRef, useState } from "react";
import getLocalUserInfo from "../../components/../utils/getLocalUserInfo";
import startTimer from "../../components/../utils/startTimer";
import stopTimer from "../../components/../utils/stoptimer";
import { socket } from "../../components/../socket";
import generateGameStateValues from "../../components/../utils/generateGameStateValues";
import { AppAuth } from "../../components/../utils/AppAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { VersusTab } from "../../components/VersusTab";
import countGameStateScore from "../../components/../utils/countGameStateScore";
import { MatchHistoryTab } from "../../components/MatchHistoryTab";

export default function VersusPage() {
    const navigate = useNavigate()
    const location = useLocation()
    console.log(location.state)
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const timeDurationState = useState<number>(30)
    const gameStateState = useState<number[][]>()

    const scoresRowsState = useState<number>(15)
    const scoresColsState = useState<number>(15)
    const scoresDurationState = useState<number>(30)

    const [stagingOppGameState, setStagingOppGameState] = useState<any[]>() 
    const oppGameStateState = useState<any[]>([])
    const oppScreenRef = useRef<any>();
    const oppRowsState = useState(15)
    const oppColsState = useState(15)

    const [oppRows, setOppRows] = oppRowsState
    const [oppCols, setOppCols] = oppColsState

    const [gameStateValues, setGameStateValues] = useState(generateGameStateValues(rowsState[0], colsState[0]))
    const gameScreenRef = useRef<any>();
    const timeValueState = useState<number>(30)
    const [oppIsReady, setOppIsReady] = useState(false)
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
    const userInfo = AppAuth.getUserInfo()
    const [oppUserInfo, setOppUserInfo] = useState({})
    const timer = useRef<number>()


    useEffect(function connectToSocket() {
        socket.connect()
        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(function resetRouterState() {
        return () => window.history.replaceState({}, '')
    })

    useEffect(function updateOppGameStateInfo() {
        if(!stagingOppGameState) return
        setOppRows(stagingOppGameState.length)
        setOppCols(stagingOppGameState[0].length)
    }, [stagingOppGameState])

    useEffect(function sendToLoginPageIfNotLoggedIn() {
        if(AppAuth.getUserInfo() === undefined) {
            navigate("/entry/login", {state: { redirect: "/versus" }})
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
        function onJoinedRoom() {
            setUserInRoom(true)
            setOppIsReady(false)
            socket.emit("getOppUserInfo")
            socket.emit("sendGameState", gameStateState[0])
        }
        function onWaitingForRoom() {
        }
        function onOpponentLeftRoom() {
            setGameIsActive(false)    
            setAllowDisplayScore(false)
            setUserInRoom(false)
        }
        function onGetOppGameState(state: any) {
            setStagingOppGameState(state)
        }
        function onStartGame(stateValues: any) {
            setGameStateValues(stateValues)
            setGameIsActive(true)
            setAllowDisplayScore(true)
        }
        function onOpponentIsReady(ready: boolean) {
            setOppIsReady(ready)
        }
        function onGetOppUserInfo(oppUserInfo: any) {
            setOppUserInfo(oppUserInfo)    
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on("joinedRoom", onJoinedRoom);
        socket.on("getOppUserInfo", onGetOppUserInfo);
        socket.on("getOppGameState", onGetOppGameState);
        socket.on("waitingForRoom", onWaitingForRoom);
        socket.on("opponentLeftRoom", onOpponentLeftRoom);
        socket.on("opponentIsReady", onOpponentIsReady)
        socket.on("startGame", onStartGame)

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("joinedRoom", onJoinedRoom);
            socket.off("getOppUserInfo", onGetOppUserInfo);
            socket.off("getOppGameState", onGetOppGameState);
            socket.off("waitingForRoom", onWaitingForRoom);
            socket.off("opponentLeftRoom", onOpponentLeftRoom);
            socket.off("opponentIsReady", onOpponentIsReady)
            socket.off("startGame", onStartGame)
        }
    }, [gameStateState[0]])

    useEffect(function sendGameState() {
        if(userInRoom) {
            socket.emit("sendGameState", gameStateState[0])
            socket.emit("sendScore", score)
        }
    }, [score])

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
            socket.emit("finishGame")
        } 
    }, [gameIsActive])

    useEffect(function resetScoreAndTimer() {
        if(gameIsActive) {
            setScore(0)
            timeValueState[1](timeDurationState[0])
            setUserPlayedGame(true)
            setOppIsReady(false)
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
                <div className="w-3/4 h-[400px] flex flex-col items-center bg-app-primary rounded-lg">
                    <div className="w-full flex flex-row min-h-[50px]">
                        <button className="flex-grow" onClick={() => setOptionsTab("Game")}>Game</button>
                        <button className="flex-grow" onClick={() => setOptionsTab("Score")}>Scores</button>
                    </div>
                    {optionsTab==="Game" && <VersusTab gameIsActive={gameIsActive} rowsState={rowsState} colsState={colsState} timeValueState={timeValueState} timeDurationState={timeDurationState} score={score} userInRoomState={userInRoomState} oppUserInfo={oppUserInfo} oppIsReady={oppIsReady}/> }
                    {optionsTab==="Score" && <MatchHistoryTab userInfo={userInfo} rowsState={scoresRowsState} colsState={scoresColsState} durationState={scoresDurationState} />}
                </div>
                <div ref={oppScreenRef} className="w-3/4 h-[400px] flex flex-col items-center overflow-auto">
                    <GameScreen gameStateValues={gameStateValues} width={oppWidth} height={oppHeight} score={oppScore} setScore={setOppScore} gameIsActive={gameIsActive} rows={oppRows} cols={oppCols} gameScreenRef={oppScreenRef} allowDisplayScore={allowDisplayScore} gameStateState={oppGameStateState} stagingGameState={stagingOppGameState}/>
                </div>
            </div>
        </>
    )
}