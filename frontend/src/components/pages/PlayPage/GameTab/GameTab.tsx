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

function ScoreAndTimerTab({ setGameIsActive, timeDuration, score }: {setGameIsActive: Function, timeDuration: number, score: number}) {
    return (
        <>
            Timer Left:
            <Timer setGameIsActive={setGameIsActive} timeDuration={timeDuration} />
            Score:
            <Score score={score} />
        </>
    ) 
}


function OptionButton({value, setValue, unit}: {value: number, setValue: Function, unit: string}) {
    return(
            <Button intent="secondary" size="full" value={value} onClick={(e: any) => {setValue(e.target.value)}}>{value} {unit}</Button>
    )
}

function Dropdown({ list, setValue, unit }: { list: any, setValue: Function, unit: string }) {
    let count = 0 
    return(
        <div className="grid w-9/12 grid-cols-3 gap-x-2 gap-y-2 justify-center items-center mt-2">
            {
                list.map((x: number) => {
                    count += 1;
                    return <OptionButton key={count} value={x} setValue={setValue} unit={unit} />
                })
            }
        </div>
    )
}

function DropdownButton({ value, unit, children }: { value: number, unit: string, children: React.ReactNode }) {
    const [dropdownIsActive, setDropdownIsActive] = useState<boolean>(false)
    return(
        <div className="w-full flex flex-col justify-center items-center my-2">
            <Button className="flex flex-row items-center justify-between" intent="secondary" size="large" onClick={() => {setDropdownIsActive(x => !x)}}>
                {value} {unit}
                <SlArrowDown />
            </Button>
            {dropdownIsActive && children}
        </div> 
    )
}


function GameSetting({ setGameIsActive, rowsState, colsState, timeDurationState, setAllowDisplayScore }: { setGameIsActive: Function, rowsState: [number, Function], colsState: [number, Function], timeDurationState: [number, Function], setAllowDisplayScore: Function }) {
    const [timerDuration, setTimerDuration] = timeDurationState
    const [rows, setRows] = rowsState
    const [cols, setCols] = colsState 

    return(
        <div className="w-full flex flex-col items-center">
            <DropdownButton value={timerDuration} unit={TIMER_UNIT}>
                <Dropdown list={DURATION_OPTIONS} setValue={setTimerDuration} unit={TIMER_UNIT} />
            </DropdownButton>
            <DropdownButton value={rows} unit={ROWS_UNIT}>
                <Dropdown list={ROWS_OPTIONS} setValue={setRows} unit={ROWS_UNIT}/>
            </DropdownButton>
            <DropdownButton value={cols} unit={COLS_UNIT}>
                <Dropdown list={COLS_OPTIONS} setValue={setCols} unit={COLS_UNIT} />
            </DropdownButton>
            <Button intent="primary" size="large" onClick={() => {
                setGameIsActive(true)
                setAllowDisplayScore(true)
            }}>Play</Button>
        </div>
    )
}

export default function GameTab({ gameIsActive, setGameIsActive, rowsState, colsState, timeDurationState, score, setAllowDisplayScore }: {gameIsActive: boolean, setGameIsActive: Function, rowsState: [number, Function], colsState: [number, Function], timeDurationState: [number, Function], score: number, setAllowDisplayScore: Function}) {
    return (
        <>
            {!gameIsActive && <GameSetting setGameIsActive={setGameIsActive} rowsState={rowsState} colsState={colsState} timeDurationState={timeDurationState} setAllowDisplayScore={setAllowDisplayScore} />}
            {gameIsActive && <ScoreAndTimerTab setGameIsActive={setGameIsActive} timeDuration={timeDurationState[0]} score={score} />}
        </>
    )
}
