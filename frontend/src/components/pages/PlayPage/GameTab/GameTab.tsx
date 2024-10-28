import { Timer } from "../../../Timer"
import { Score } from "../../../Score"
import { Button } from "../../../Button"
import { SlArrowDown } from "react-icons/sl";
import { useState, useRef, useEffect } from "react";

const DURATION_OPTIONS = [30, 60, 90]
const ROWS_OPTIONS = [8, 12, 15]
const COLS_OPTIONS = [8, 12, 15]
const TIMER_UNIT = "seconds"
const ROWS_UNIT = "rows"
const COLS_UNIT = "cols"

function ScoreAndTimerTab({ setGameIsActive, timeValueState, score, timer }: {setGameIsActive: Function, timeValueState: [number, Function], score: number, timer: any}) {

    return (
        <>
            Timer Left:
            <Timer setGameIsActive={setGameIsActive} timeValueState={timeValueState} timer={timer}/>
            Score:
            <Score score={score} />
        </>
    ) 
}


function OptionButton({value, valueState, unit}: {value: number, valueState: [number, Function], unit: string}) {
    const [activeValue, setActiveValue] = valueState

    return(
            <Button intent="secondary" size="full" border={activeValue === value ? "white" : "none"} value={value} onClick={(e: any) => {setActiveValue(+e.target.value)}}>{value} {unit}</Button>
    )
}

function Dropdown({ list, valueState, unit }: { list: any, valueState: [number, Function], unit: string }) {
    let count = 0 
    return(
        <div className="grid w-9/12 grid-cols-3 gap-x-2 gap-y-2 justify-center items-center mt-2">
            {
                list.map((x: number) => {
                    count += 1;
                    return <OptionButton key={count} value={x} valueState={valueState} unit={unit} />
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
                <Dropdown list={DURATION_OPTIONS} valueState={timeDurationState} unit={TIMER_UNIT} />
            </DropdownButton>
            <DropdownButton value={rows} unit={ROWS_UNIT}>
                <Dropdown list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT}/>
            </DropdownButton>
            <DropdownButton value={cols} unit={COLS_UNIT}>
                <Dropdown list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} />
            </DropdownButton>
            <Button intent="primary" size="large" onClick={() => {
                setGameIsActive(true)
                setAllowDisplayScore(true)
            }}>Play</Button>
        </div>
    )
}

export default function GameTab({ gameIsActive, setGameIsActive, rowsState, colsState, timeValueState, timeDurationState, score, setAllowDisplayScore, timer}: {gameIsActive: boolean, setGameIsActive: Function, rowsState: [number, Function], colsState: [number, Function], timeValueState: [number, Function], timeDurationState: [number, Function], score: number, setAllowDisplayScore: Function, timer: any}) {

    return (
        <>
            {!gameIsActive && <GameSetting setGameIsActive={setGameIsActive} rowsState={rowsState} colsState={colsState} timeDurationState={timeDurationState} setAllowDisplayScore={setAllowDisplayScore} />}
            {gameIsActive && <ScoreAndTimerTab setGameIsActive={setGameIsActive} timeValueState={timeValueState} score={score} timer={timer} />}
        </>
    )
}
