import { useEffect, useState, useRef } from "react"

export default function Timer() {
    const [time, setTime] = useState(10)
    const timer = useRef<number>()
    const stopTimer = () => {
        clearInterval(timer.current)
        timer.current = 0
    }
    const startTimer = () => {
        if(timer.current) return;
        timer.current = setInterval(() => {
            setTime((time) => {
                if(time === 0) {
                    stopTimer();
                    return 0; 
                }
                return time - 1
            });
        }, 1000) 
    }
    useEffect(() => {
        startTimer()
    }, []) 

    return(
        <>
            <div className="bg-app-tertiary w-3/5">
                {time}
            </div>
            <button onClick={stopTimer}>stop</button>
            <button onClick={startTimer}>start</button>
        </>
    )
}