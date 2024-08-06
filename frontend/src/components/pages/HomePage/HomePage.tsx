import { GameScreen } from "../../GameScreen"
import { Sidebar } from "../../Sidebar"

export default function HomePage() {
    return (
        <>
            <div className="w-screen h-screen flex flex-row">
                <Sidebar /> 
                <div className="flex-grow border-black">
                    <GameScreen width={800} height={800} /> 
                </div>
            </div>
        </>
    )
}