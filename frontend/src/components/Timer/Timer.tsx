import { useEffect, useState, useRef } from "react"

export default function Timer() {
    const [time, setTime] = useState(100)
    const timer = useRef<number>()
    const stopTimer = () => {
        clearInterval(timer.current)
        timer.current = 0
    }
    const startTimer = () => {
        if(timer.current) return;
        timer.current = setInterval(() => {
            setTime(time => time - 1);
        }, 1000) 
    }
    useEffect(() => {
        startTimer()
        setInterval(() => {
            console.log(typeof(timer.current))
            console.log(timer.current)
        }, 1000)
    }, []) 

    return(
        <>
            <div className="bg-app-tertiary">
                {time}
            </div>
            <button onClick={stopTimer}>stop</button>
            <button onClick={startTimer}>start</button>
        </>
    )
}