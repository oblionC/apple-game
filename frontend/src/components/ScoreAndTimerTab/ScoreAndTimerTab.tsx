import { Timer } from "../Timer"
import Score from "../Score/Score"

export default function ScoreAndTimerTab({ timeValueState, score }: {timeValueState: [number, Function], score: number}) {
    return (
        <div className="w-full flex flex-col justify-center items-center no-scrollbar overflow-auto">
            <Timer timeValueState={timeValueState} />
            <Score score={score} />
        </div>
    ) 
}