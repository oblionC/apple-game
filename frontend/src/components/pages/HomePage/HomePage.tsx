import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../../Sidebar"
import { Timer } from "../../Timer";

export default function HomePage() {
    const gameScreenRef = useRef<any>();
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [timeIsUp, setTimeIsUp] = useState<boolean>(false)
    
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
                        <GameScreen width={width} height={height} allowPlay={!timeIsUp} />
                    </div>
                    <div className="grow flex flex-col justify-center items-center">
                        <Timer setTimeIsUp={setTimeIsUp} />
                    </div>
                </div>
            </div>
        </>
    )
}