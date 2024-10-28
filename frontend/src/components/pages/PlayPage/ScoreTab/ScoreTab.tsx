import { ScoreCard } from "./ScoreCard"

export default function ScoreTab() {
    return (
        <div className="w-full h-full flex flex-col items-center overflow-auto">
            <ScoreCard />
            <ScoreCard />
            <ScoreCard />
        </div>
    )
}