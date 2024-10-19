import { Button } from "../Button"
import logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"


export default function Sidebar() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({})
    const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(false)

    function handleLogout() {
        localStorage.removeItem('applegame-user')
        setUserIsLoggedIn(false)
        setUserInfo({})
    }

    useEffect(() => {
        const applegameUser = localStorage.getItem("applegame-user")
        if(applegameUser) {
            setUserIsLoggedIn(true)
            setUserInfo(JSON.parse(applegameUser))
        }
    }, [])

    return(
        <div className="flex-col bg-app-primary h-screen w-36 sticky top-0">
            <div className="font-medium text-lg p-5">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-auto mb-0">
                {userInfo.username !== undefined && userInfo.username}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/signup')}>Sign Up</Button>}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/login')} >Log In</Button>}
                {userIsLoggedIn && <Button intent="primary" size="medium" onClick={handleLogout} >Log Out</Button>}
            </div>
        </div>
    )
}