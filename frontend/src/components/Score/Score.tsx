export default function Score({ score }: { score: number }) {
    return(
        <div className="text-3xl bg-app-tertiary w-9/12 h-[200px] p-2 m-2 flex flex-col items-center justify-between rounded-lg ">
            <div className="text-xl">
                Score: 
            </div>
            <div className="text-5xl">
                {score}
            </div>
            <div>
            </div>
        </div>
    )
}