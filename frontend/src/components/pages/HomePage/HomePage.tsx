import { GameScreen } from "../../GameScreen"
import { Sidebar } from "../../Sidebar"

export default function HomePage() {
    return (
        <>
            <div className="w-screen h-screen flex flex-row">
                <Sidebar /> 
                <div className="w-full flex-grow border-black">
                    <GameScreen width={1500} height={window.innerHeight} /> 
                </div>
            </div>
        </>
    )
}