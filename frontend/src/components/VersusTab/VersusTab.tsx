import { DropdownButton } from "../DropdownButton"
import { RadioSelect } from "../RadioSelect"
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../constants/gameOptions"
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../constants/optionUnits";

export default function VersusTab({ gameIsActive, setGameIsActive, rowsState, colsState, timeValueState, timeDurationState, score, setAllowDisplayScore, timer}: {gameIsActive: boolean, setGameIsActive: Function, rowsState: [number, Function], colsState: [number, Function], timeValueState: [number, Function], timeDurationState: [number, Function], score: number, setAllowDisplayScore: Function, timer: any}) {
    const [timerDuration, setTimerDuration] = timeDurationState
    const [rows, setRows] = rowsState
    const [cols, setCols] = colsState 

    return(
        <div className="w-full flex flex-col items-center">
            <DropdownButton value={timerDuration} unit={DURATION_UNIT}>
                <RadioSelect list={DURATION_OPTIONS} valueState={timeDurationState} unit={DURATION_UNIT} />
            </DropdownButton>
            <DropdownButton value={rows} unit={ROWS_UNIT}>
                <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT}/>
            </DropdownButton>
            <DropdownButton value={cols} unit={COLS_UNIT}>
                <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} />
            </DropdownButton>
        </div>
    )
}