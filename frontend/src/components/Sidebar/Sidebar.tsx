import { Button } from "../Button"
import logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom"

export default function Sidebar() {
    const navigate = useNavigate()

    return(
        <div className="flex-col bg-app-primary h-screen w-36 sticky top-0">
            <div className="font-medium text-lg p-5">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-auto mb-0">
                <Button intent="primary" size="medium" onClick={() => navigate('entry/signup')}>Sign Up</Button>
                <Button intent="primary" size="medium" onClick={() => navigate('entry/login')} >Log In</Button>
            </div>
        </div>
    )
}