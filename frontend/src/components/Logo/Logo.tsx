import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

export default function Logo() {
    const navigate = useNavigate()

    return (
        <div className="w-full flex justify-center">
            <img src={logo} className="w-1/3 hover:cursor-pointer" onClick={() => navigate("/")} /> 
        </div>
    )
}