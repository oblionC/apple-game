import { DropdownButton } from "../DropdownButton"
import { RadioSelect } from "../RadioSelect"
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../constants/gameOptions"
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../constants/optionUnits";
import { Button } from "../Button";
import { socket } from "../../socket";
import { useEffect, useState } from "react";
import { AppAuth } from "../../utils/AppAuth";
import { ScoreAndTimerTab } from "../ScoreAndTimerTab";
import { LobbyUser } from "../LobbyUser";

type VersusTabProps = {
    gameIsActive: boolean, 
    rowsState: [number, Function], 
    colsState: [number, Function], 
    timeValueState: [number, Function], 
    timeDurationState: [number, Function], 
    score: number, 
    userInRoomState: [boolean, Function],
    oppUserInfo: any,
    oppIsReady: boolean
}

export default function VersusTab({ 
    gameIsActive, 
    rowsState, 
    colsState, 
    timeValueState, 
    timeDurationState, 
    score, 
    userInRoomState,
    oppUserInfo,
    oppIsReady,
}: VersusTabProps) {
    const [userInfo, setUserInfo] = useState()
    const [view, setView] = useState("Options")
    const [ready, setReady] = useState(false)
    const [userInRoom, setUserInRoom] = userInRoomState

    useEffect(function initializeSockets() {
        function onGetReady(ready: boolean) {
            console.log(ready)
            setReady(ready) 
        }

        socket.on("playerIsReady", onGetReady)

        return () => {
            socket.off("playerIsReady", onGetReady)
        }
    })

    useEffect(function unreadyUser() {
        setReady(false)
    }, [gameIsActive, userInRoom])

    useEffect(function detectGameHasStarted() {
        if(gameIsActive)
            setView("Playing")
        else {
            if(userInRoom) {
                setView("Lobby")
            }
            else {
                setView("Options")
            }
        }
    }, [gameIsActive])

    useEffect(function getUserInfo() {
        var userInfo = AppAuth.getUserInfo()
        if (userInfo !== undefined) {
            setUserInfo(userInfo)
        }
    }, [])

    useEffect(function changeViewWhenUserInRoomChanges() {
        if(userInRoom) {
            setView("Lobby")
        }
        else {
            setView("Options")
        }
    }, [userInRoom])

    return(
        <>
            {view === "Options" && (
                <div className="w-full flex flex-col items-center no-scrollbar">
                    <DropdownButton value={timeDurationState[0]} unit={DURATION_UNIT}>
                        <RadioSelect list={DURATION_OPTIONS} valueState={timeDurationState} unit={DURATION_UNIT} />
                    </DropdownButton>
                    <DropdownButton value={rowsState[0]} unit={ROWS_UNIT}>
                        <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT}/>
                    </DropdownButton>
                    <DropdownButton value={colsState[0]} unit={COLS_UNIT}>
                        <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} />
                    </DropdownButton>
                    <Button intent="primary" size="large" onClick={() => {
                        socket.emit("joinQueue", userInfo, rowsState[0], colsState[0], timeDurationState[0])
                        setView("Waiting")
                    }}>Join Queue</Button>
                </div>
            )}
            {view === "Waiting" && (
                <span className="text-white h-full flex justify-center items-center">
                    Waiting for players...
                </span>
            )}
            {view === "Playing" && (
                <ScoreAndTimerTab timeValueState={timeValueState} score={score} />
            )}
            {view === "Lobby" && (
                <div className="flex flex-col items-center w-full py-10 overflow-auto no-scrollbar">
                    <div className="w-full">
                        <Button intent="primary" size="large" onClick={() => {
                            socket.emit("playerIsReady")
                        }}>{ready ? "Unready" : "Ready"}</Button>
                        <Button intent="primary" size="large" onClick={() => {
                            socket.emit("leaveRoom")
                            setUserInRoom(false)
                        }}>Leave</Button>
                    </div>
                    <div className="w-9/12 my-5 bg-app-tertiary p-2 rounded-lg">
                        <div className="h-10 flex items-center justify-center">
                            Vs.
                        </div>
                        {oppUserInfo && <LobbyUser userInfo={oppUserInfo[0]} userIsReady={oppIsReady} />}
                    </div>
                </div>
            )}
        </> 
    )
}