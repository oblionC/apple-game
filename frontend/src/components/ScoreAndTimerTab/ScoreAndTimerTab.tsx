import { Timer } from "../Timer"
import Score from "../Score/Score"

export default function ScoreAndTimerTab({ setGameIsActive, timeValueState, score, timer }: {setGameIsActive: Function, timeValueState: [number, Function], score: number, timer: any}) {
    return (
        <div className="no-scrollbar overflow-auto">
            Timer Left:
            <Timer setGameIsActive={setGameIsActive} timeValueState={timeValueState} timer={timer}/>
            Score:
            <Score score={score} />
        </div>
    ) 
}