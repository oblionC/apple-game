import { useNavigate } from "react-router-dom"
import userPlaceholder from "../../assets/user_placeholder.jpg"

export default function LobbyUser({ userInfo }: { userInfo: any }) {
    const navigate = useNavigate()
    return (
        <div className="w-full p-2 h-20 flex">
            <div className="h-full flex">
                <div className="transition-all ease-in-out duration-500 aspect-square rounded-full overflow-hidden bg-black">
                    <img src={userPlaceholder} onClick={() => navigate("profile")}/> 
                </div>
            </div>
            <div className="h-full flex flex-grow justify-center items-center p-4">
                {userInfo && userInfo.userInfo.username } 
            </div>
            <div className="h-full flex items-center p-4">
                {userInfo && userInfo.ready ? "Ready" : "Unready"} 
            </div>
        </div>
    )
}