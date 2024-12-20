export default function ScoreCard({ position, score }: { position: number, score: any }) {
    return(
        <div className="w-9/12 h-20 my-2 bg-app-tertiary rounded-lg flex justify-evenly items-center">
            <div className="">
                #{position}
            </div>
            <div>
                {score.score}
            </div>
            <div>
                {new Date(score.timeStamp).toLocaleString()}
            </div>
        </div>
    )
}