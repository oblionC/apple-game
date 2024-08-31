import { Timer } from "../../../Timer"
import { Score } from "../../../Score"
import { Button } from "../../../Button"
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";

const DURATION_OPTIONS = [30, 60, 90]
const ROWS_OPTIONS = [8, 12, 15]
const COLS_OPTIONS = [8, 12, 15]
const TIMER_UNIT = "seconds"
const ROWS_UNIT = "rows"
const COLS_UNIT = "cols"

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


function OptionButton({value, setValue, unit}: {value: number, setValue: Function, unit: string}) {
    return(
            <Button intent="secondary" size="full" value={value} onClick={(e) => {setValue(e.target.value)}}>{value} {unit}</Button>
    )
}

function Dropdown({ children }: { children: React.ReactNode }) {
    return(
        <div className="grid w-9/12 grid-cols-3 gap-x-2 gap-y-2 justify-center items-center mt-2">
            { children }
        </div>
    )
}

function TimerDropdown({setValue, unit}: {setValue: Function, unit: string}) {
    return(
        <Dropdown>
            {DURATION_OPTIONS.map((duration) => {
                return <OptionButton value={duration} setValue={setValue} unit={unit} />
            })}
        </Dropdown>
    )
}

function RowsDropdown( { setValue, unit }: {setValue: Function, unit: string}) {
    return(
        <Dropdown>
            {ROWS_OPTIONS.map((row) => {
                return <OptionButton value={row} setValue={setValue} unit={unit} />
            })}
        </Dropdown>
    )
}

function DropdownButton({ value, unit, children }: { value: number, unit: string, children: React.ReactNode }) {
    const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false)
    return(
        <div className="w-full flex flex-col justify-center items-center my-2">
            <Button className="flex flex-row items-center justify-between" intent="secondary" size="medium" onClick={() => {setDropdownIsActive(x => !x)}}>
                {value} {unit}
                <SlArrowDown />
            </Button>
            {dropdownIsActive && children}
        </div> 
    )
}

export default function GameConfig({ setTimeIsUp, score }: {setTimeIsUp: Function, score: number}) {
    const [timerDuration, setTimerDuration] = useState<number>(DURATION_OPTIONS[0])
    const [rows, setRows] = useState<number>(ROWS_OPTIONS[0])
    const [cols, setCols] = useState<number>(COLS_OPTIONS[0])

    return(
        <div className="w-full flex flex-col items-center">
            <DropdownButton value={timerDuration} unit={TIMER_UNIT}>
                <TimerDropdown setValue={setTimerDuration} unit={TIMER_UNIT} />
            </DropdownButton>
            <DropdownButton value={rows} unit={ROWS_UNIT}>
                <RowsDropdown setValue={setRows} unit={ROWS_UNIT}/>
            </DropdownButton>
            <DropdownButton value={cols} unit="columns">
                <RowsDropdown setValue={setCols}/>
            </DropdownButton>
        </div>
        // <ScoreAndTimerTab setTimeIsUp={setTimeIsUp} score={score} />
    )
}