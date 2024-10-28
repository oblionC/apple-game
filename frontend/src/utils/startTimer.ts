import stopTimer from "./stoptimer";

export default function startTimer (timer: any, setTime: Function, setGameIsActive: Function) {
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
            setGameIsActive(false)
            stopTimer(timer)
        } 
    }, 1000) 
}
