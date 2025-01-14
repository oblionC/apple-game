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
            <div className="w-full flex justify-center items-center">
                <div  className="h-[700px] container justify-center bg-app-tertiary rounded-lg">
                    <div className={`container mx-auto h-full flex flex-row`}> 
                        <div ref={firstSectionRef}>
                            <GameScreen gameStateValues={gameStateValues.current} width={gameScreenHeight} height={gameScreenHeight} gameIsActive={false} rows={15} cols={15} score={undefined} setScore={undefined} gameScreenRef={firstSectionRef} allowDisplayScore={undefined} gameStateState={gameStateState}/>
                        </div>
                        <div className="w-full flex flex-col justify-center">
                            <div>
                                <div className="text-[70px] font-semibold mb-10">
                                    Put your pattern recognition to the test!
                                </div>
                                <button className="w-9/12 font-semibold border-solid border-black bg-app-quaternary rounded-3xl text-[50px] p-4" onClick={() => navigate("play", {state: {rows: 15, cols: 15}})}>Play Now!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}