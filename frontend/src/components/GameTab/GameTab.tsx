import { Button } from "../Button"
import { SlArrowDown } from "react-icons/sl";
import { useState } from "react";
import { RadioSelect } from "../RadioSelect";
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../constants/gameOptions"
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../constants/optionUnits";
import { ScoreAndTimerTab } from "../ScoreAndTimerTab";

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
    return(
        <div className="w-full flex flex-col items-center pt-10">
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
                setGameIsActive(true)
                setAllowDisplayScore(true)
            }}>Play</Button>
        </div>
    )
}

export default function GameTab({ gameIsActive, setGameIsActive, rowsState, colsState, timeValueState, timeDurationState, score, setAllowDisplayScore}: {gameIsActive: boolean, setGameIsActive: Function, rowsState: [number, Function], colsState: [number, Function], timeValueState: [number, Function], timeDurationState: [number, Function], score: number, setAllowDisplayScore: Function}) {

    return (
        <>
            {!gameIsActive && <GameSetting setGameIsActive={setGameIsActive} rowsState={rowsState} colsState={colsState} timeDurationState={timeDurationState} setAllowDisplayScore={setAllowDisplayScore} />}
            {gameIsActive && <ScoreAndTimerTab timeValueState={timeValueState} score={score} />}
        </>
    )
}
