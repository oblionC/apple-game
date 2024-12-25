export default function Timer({ timeValueState }: { timeValueState: [number, Function] }) {
    return(
        <div className="text-9xl bg-app-tertiary w-3/5 p-5 flex items-center justify-center">
            <div className="align-middle">
                {timeValueState[0]}
            </div>
        </div>
    )
}