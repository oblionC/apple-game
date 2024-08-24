import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { Timer } from "../../Timer";
import Score from "../../Score/Score";
import { useLocation } from "react-router-dom";

export default function PlayPage() {
    const {state} = useLocation()
    const { rows, cols } = state
    const gameScreenRef = useRef<any>();
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [timeIsUp, setTimeIsUp] = useState<boolean>(false)
    const [score, setScore] = useState<number>(0)
    
    useEffect(() => {
        setWidth(gameScreenRef.current.clientWidth)
        setHeight(gameScreenRef.current.scrollHeight)
    }, [])
    return (
        <>
            <div ref={gameScreenRef} className="w-3/5">
                <GameScreen width={width} height={height} setScore={setScore} allowPlay={!timeIsUp} rows={rows} cols={cols} />
            </div>
            <div className="grow flex flex-col items-center justify-evenly">
                <Timer setTimeIsUp={setTimeIsUp} />
                <Score score={score} />
            </div>
        </>
    )
}