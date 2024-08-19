import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../../Sidebar"
import { Timer } from "../../Timer";
import Score from "../../Score/Score";

export default function HomePage() {
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
            <div className="w-screen h-screen flex flex-row">
                <Sidebar /> 
                <div className="bg-app-secondary w-full flex grow">
                    <div ref={gameScreenRef} className="w-3/5">
                        <GameScreen width={width} height={height} setScore={setScore} allowPlay={!timeIsUp} />
                    </div>
                    <div className="grow flex flex-col items-center justify-evenly">
                        <Timer setTimeIsUp={setTimeIsUp} />
                        <Score score={score} />
                    </div>
                </div>
            </div>
        </>
    )
}