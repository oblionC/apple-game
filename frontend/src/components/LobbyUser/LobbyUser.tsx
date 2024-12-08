import { useNavigate } from "react-router-dom"
import userPlaceholder from "../../assets/user_placeholder.jpg"

export default function LobbyUser() {
    const navigate = useNavigate()
    return (
        <div className="w-full h-20 bg-black flex ">
            <div className="transition-all ease-in-out duration-500 aspect-square rounded-full overflow-hidden bg-black">
                <img src={userPlaceholder} onClick={() => navigate("profile")}/> 
            </div>
        </div>
    )
}