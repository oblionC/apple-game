import { useEffect, useState, useRef } from "react"



export default function Timer({ setGameIsActive, timeValueState, timer }: { setGameIsActive: Function, timeValueState: [number, Function], timer: any}) {
   const [time, setTime] = timeValueState
    return(
        <div className="text-9xl bg-app-tertiary w-3/5 p-5 flex items-center justify-center">
            <div className="align-middle">
                {time}
            </div>
        </div>
    )
}