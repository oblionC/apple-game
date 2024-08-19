import { useEffect, useState, useRef } from "react"
import { TIME_DURATION } from "../GameScreen/constants";

const startTimer = (timer: any, setTime: Function, setTimeIsUp: Function) => {
    if(timer.current) return;
    let timeUp = false;
    timer.current = setInterval(() => {
        setTime((t: number) => {
            if(t <= 1) {
                timeUp = true;
                return 0; 
            }
            return t - 1
        });
        if(timeUp) {
            setTimeIsUp(true)
            stopTimer(timer)
        } 
    }, 1000) 
}

const stopTimer = (timer: any) => {
    clearInterval(timer.current)
    timer.current = 0
}

export default function Timer({ setTimeIsUp }: { setTimeIsUp: Function }) {
    const [time, setTime] = useState<number>()
    const timer = useRef<number>()
    useEffect(() => {
        setTime(TIME_DURATION)
        startTimer(timer, setTime, setTimeIsUp)
    }, [])
    return(
        <div className="text-9xl bg-app-tertiary w-3/5 p-5 flex items-center justify-center">
            <div className="align-middle">
                {time}
            </div>
        </div>
    )
}