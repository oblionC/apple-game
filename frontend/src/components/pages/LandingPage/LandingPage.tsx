import { useEffect, useRef, useState } from "react";
import { GameScreen } from "../../GameScreen";
import { useNavigate } from "react-router-dom";
import generateGameStateValues from "../../../utils/generateGameStateValues";

export default function LandingPage() {
    const navigate = useNavigate()
    const firstSectionRef: any = useRef(null)
    const gameStateValues = useRef(generateGameStateValues(15, 15))
    const gameStateState = useState()
    const [gameScreenHeight, setGameScreenHeight] = useState<number>(0)
    useEffect(() => {
        if(firstSectionRef.current) {
            let height = firstSectionRef.current.clientHeight
            setGameScreenHeight(height)
        }
    }, [])
    return(
        <>
            <div className="w-full overflow-y-scroll">
                <div ref={firstSectionRef} className="h-[700px] justify-center bg-app-tertiary">
                    <div className={`container mx-auto h-full flex flex-row`}> 
                        <GameScreen gameStateValues={gameStateValues.current} width={gameScreenHeight} height={gameScreenHeight} gameIsActive={false} rows={15} cols={15} score={undefined} setScore={undefined} gameScreenRef={undefined} allowDisplayScore={undefined} gameStateState={gameStateState}/>
                        <div className="w-full flex flex-col justify-center">
                            <div>
                                <div className="text-[70px]">
                                    Put your pattern recognition to the test!
                                </div>
                                <button className="border-solid border-black bg-app-quaternary rounded-3xl text-[50px] p-4" onClick={() => navigate("play", {state: {rows: 15, cols: 15}})}>Play Now!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}