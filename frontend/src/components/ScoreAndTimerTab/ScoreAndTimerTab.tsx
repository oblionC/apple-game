import { Timer } from "../Timer"
import Score from "../Score/Score"

export default function ScoreAndTimerTab({ timeValueState, score }: {timeValueState: [number, Function], score: number}) {
    return (
        <div className="no-scrollbar overflow-auto">
            Timer Left:
            <Timer timeValueState={timeValueState} />
            Score:
            <Score score={score} />
        </div>
    ) 
}