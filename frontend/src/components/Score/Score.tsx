export default function Score({ score }: { score: number }) {
    return(
        <div className="text-9xl bg-app-tertiary w-3/5 p-5 flex items-center justify-center">
            <div className="align-middle">
                {score}
            </div>
        </div>
    )
}