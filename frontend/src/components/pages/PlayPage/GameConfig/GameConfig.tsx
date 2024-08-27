import { Timer } from "../../../Timer"
import { Score } from "../../../Score"

export default function GameConfig({ setTimeIsUp, score }: {setTimeIsUp: Function, score: number}) {
    return(
        <div className="w-full flex flex-col items-center">
            Timer Left:
            <Timer setTimeIsUp={setTimeIsUp} />
            Score:
            <Score score={score} />
        </div>
    )
}