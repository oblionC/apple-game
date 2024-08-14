import { Button } from "../Button"
import logo from '../../assets/logo.png'

export default function Sidebar() {
    return(
        <div className="flex-col bg-app-primary h-screen w-36 sticky top-0">
            <div className="font-medium text-lg p-5">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-auto mb-0">
                <Button text="Sign Up" />
                <Button text="Log In" />
            </div>
        </div>
    )
}