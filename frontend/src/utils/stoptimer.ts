export default function stopTimer (timer: any) {
    clearInterval(timer.current)
    timer.current = 0
}
