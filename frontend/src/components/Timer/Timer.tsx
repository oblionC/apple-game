export default function Timer({ timeValueState }: { timeValueState: [number, Function] }) {
    return(
        <div className="text-3xl bg-app-tertiary w-9/12 h-[200px] p-2 m-2 flex flex-col items-center justify-between rounded-lg ">
            <div className="text-xl">
                Timer: 
            </div>
            <div className="text-5xl">
                {timeValueState[0]}
            </div>
            <div>
            </div>
        </div>
    )
}