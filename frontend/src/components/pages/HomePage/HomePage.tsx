import { GameScreen } from "../../GameScreen"
import { Sidebar } from "../../Sidebar"

export default function HomePage() {
    return (
        <>
            <div className="w-screen h-screen flex flex-row">
                <Sidebar /> 
                <div className="bg-app-secondary w-full flex grow">
                    <div className="grow">
                        Gamescreen
                    </div>
                    <div className="grow">
                        Timer and score
                    </div>
                </div>
            </div>
        </>
    )
}