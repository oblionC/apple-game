import { useLayoutEffect, useRef, useState } from "react";
import { GameScreen } from "../../components/GameScreen";
import { useNavigate } from "react-router-dom";
import generateGameStateValues from "../../components/../utils/generateGameStateValues";

export default function LandingPage() {

    const navigate = useNavigate()
    const firstSectionRef: any = useRef(null)
    const gameStateValues = useRef(generateGameStateValues(15, 15))
    const gameStateState = useState()
    const [gameScreenWidth, setGameScreenWidth] = useState<number>(0)
    const [gameScreenHeight, setGameScreenHeight] = useState<number>(0)

    useLayoutEffect(() => {
        if(firstSectionRef.current) {
            setGameScreenWidth(firstSectionRef.current.clientWidth)
            setGameScreenHeight(firstSectionRef.current.clientHeight)
        }
    }, [])

    return(
        <>
            <div className="w-full flex justify-center items-center">
                <div  className="h-[700px] container justify-center bg-app-tertiary rounded-lg">
                    <div className="container h-full grid grid-cols-12"> 
                        <div ref={firstSectionRef} className="col-span-5">
                            <GameScreen gameStateValues={gameStateValues.current} width={gameScreenWidth} height={gameScreenHeight} gameIsActive={false} rows={15} cols={15} score={undefined} setScore={undefined} gameScreenRef={firstSectionRef} allowDisplayScore={undefined} gameStateState={gameStateState}/>
                        </div>
                        <div className="col-span-7 flex flex-col justify-center">
                            <div className="text-[70px] font-semibold mb-10">
                                Put your pattern recognition to the test!
                            </div>
                            <div>
                                <button className="w-9/12 font-semibold border-solid border-black bg-app-quaternary rounded-3xl text-[50px] p-4" onClick={() => navigate("play", {state: {rows: 15, cols: 15}})}>Play Now!</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}