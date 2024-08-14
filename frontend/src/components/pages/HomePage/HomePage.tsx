import { GameScreen } from "../../GameScreen"
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "../../Sidebar"

export default function HomePage() {
    const gameScreenRef = useRef<any>();
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
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
                        <GameScreen width={width} height={height} />
                    </div>
                    <div className="grow">
                        Timer and score
                    </div>
                </div>
            </div>
        </>
    )
}