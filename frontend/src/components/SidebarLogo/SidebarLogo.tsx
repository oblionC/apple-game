import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"

export default function SidebarLogo() {
    const navigate = useNavigate()

    return (
        <div className="flex justify-center m-5">
            <img src={logo} className="hover:cursor-pointer" onClick={() => navigate("/")} /> 
        </div>
    )
}