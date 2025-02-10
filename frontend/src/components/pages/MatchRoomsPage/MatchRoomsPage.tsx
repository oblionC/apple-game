import { useEffect, useState } from "react";
import { Button } from "../../Button";
import { DropdownButton } from "../../DropdownButton";
import { RadioSelect } from "../../RadioSelect";
import { ROWS_OPTIONS, COLS_OPTIONS, DURATION_OPTIONS } from "../../../constants/gameOptions";
import { ROWS_UNIT, COLS_UNIT, DURATION_UNIT } from "../../../constants/optionUnits";
import { UserInput } from "../../UserInput";
import { useNavigate } from "react-router-dom";

function useBufferedLoadOnComponent() {
    const [boolean, setBoolean] = useState<boolean>(false)
    const [loaded, setLoaded] = useState<boolean>(false)
    useEffect(() => {
        setLoaded(boolean)
    }, [boolean])
    return [boolean, setBoolean, loaded] as const
}

export default function MatchRoomsPage() {
    const navigate = useNavigate()
    const [creatingRoom, setCreatingRoom, loaded] = useBufferedLoadOnComponent() 
    const [hasPassword, setHasPassword] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [roomName, setRoomName] = useState<string>("")
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const durationState = useState<number>(30)

    return (
        <>
            <div className="w-full flex justify-center pt-10">
                <div className="h-full container justify-center rounded-lg overflow-auto no-scrollbar">
                    <Button intent="primary" size="large" onClick={() => setCreatingRoom(x => !x)}>Create room</Button> 
                </div>
                {
                    creatingRoom && (
                        <div className={`transition-bg-opacity ease-in-out duration-500 w-full h-full absolute top-0 left-0 bg-black ${loaded ? "bg-opacity-60" : "bg-opacity-0"}`} >
                            <div className="w-full h-full flex justify-center items-center bg-opacity-100">
                                <div className="w-[500px] h-[670px] p-2 bg-app-primary rounded-lg overflow-auto no-scrollbar"> 
                                    <span className="font-semibold text-white">
                                        Room Settings
                                    </span> 
                                    <div className="w-full flex justify-center items-center">
                                        <UserInput name="Room Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                                    </div>
                                    <DropdownButton value={durationState[0]} unit={DURATION_UNIT}>
                                        <RadioSelect list={DURATION_OPTIONS} valueState={durationState} unit={DURATION_UNIT} />
                                    </DropdownButton>
                                    <DropdownButton value={rowsState[0]} unit={ROWS_UNIT}>
                                        <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT}/>
                                    </DropdownButton>
                                    <DropdownButton value={colsState[0]} unit={COLS_UNIT}>
                                        <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} />
                                    </DropdownButton>
                                    <div className="grid grid-cols-2 w-9/12 m-auto">
                                        <label className="text-white col-span-2">
                                            <input type="checkbox" defaultChecked={hasPassword} onClick={() => {
                                                setHasPassword(x => !x)
                                                setPassword("")
                                            }} className="mr-2"/>
                                            Require Password
                                        </label> 
                                    </div> 
                                    {
                                        hasPassword && (
                                            <div className="w-full flex justify-center items-center">
                                                <UserInput name="Password" value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                                            </div>
                                        )
                                    }
                                    <div className="bottom-0">
                                        <Button intent="primary" size="large" onClick={() => navigate("/versus", {state: {xd: "wow"}})}>Create</Button>
                                        <Button intent="primary" size="large" onClick={() => setCreatingRoom(x => !x)}>Back</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    )
}