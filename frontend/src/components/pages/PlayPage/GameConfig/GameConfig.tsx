import { Timer } from "../../../Timer"
import { Score } from "../../../Score"
import { Button } from "../../../Button"
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";


function ScoreAndTimerTab({ setTimeIsUp, score }: {setTimeIsUp: Function, score: number}) {
    return (
        <>
            Timer Left:
            <Timer setTimeIsUp={setTimeIsUp} />
            Score:
            <Score score={score} />
        </>
    ) 
}

const DURATION_OPTIONS = [30, 60, 90]

function DurationOptionButton({duration, setTimerDuration}: {duration: number, setTimerDuration: Function}) {
    return(
            <Button intent="secondary" size="full" value={duration} onClick={(e) => {setTimerDuration(e.target.value)}}>{duration}s</Button>
    )
}

function TimerDropdown({setTimerDuration}: {setTimerDuration: Function}) {
    return(
        <div className="grid w-9/12 grid-cols-3 gap-x-2 gap-y-2 justify-center items-center mt-2">
            {DURATION_OPTIONS.map((duration) => {
                return <DurationOptionButton duration={duration} setTimerDuration={setTimerDuration}/>
            })}
        </div>
    )
}

export default function GameConfig({ setTimeIsUp, score }: {setTimeIsUp: Function, score: number}) {
    const [timerDuration, setTimerDuration] = useState<number>(0)
    const [timerDropdownIsActive, setTimerDropdownIsActive] = useState<boolean>(true)

    return(
        <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col justify-center items-center my-2">
                <Button className="flex flex-row items-center justify-between" intent="secondary" size="medium" onClick={() => {setTimerDropdownIsActive(x => !x)}}>
                    {timerDuration}s
                    <SlArrowDown />
                </Button>
                {timerDropdownIsActive && <TimerDropdown setTimerDuration={setTimerDuration}/>}
            </div> 
            <div className="w-full my-2">
                <Button intent="secondary" size="medium">Set Rows</Button>
            </div>
            <div className="w-full my-2">
                <Button intent="secondary" size="medium">Set Columns</Button>
            </div>
        </div>
        // <ScoreAndTimerTab setTimeIsUp={setTimeIsUp} score={score} />
    )
}