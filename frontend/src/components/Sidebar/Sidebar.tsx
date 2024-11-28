import { Button } from "../Button"
import logo from '../../assets/logo.png'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import getLocalUserInfo from "../../utils/getLocalUserInfo"
import { AppAuth } from "../../utils/AppAuth"


export default function Sidebar() {
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState()
    const [userIsLoggedIn, setUserIsLoggedIn] = useState<boolean>(false)

    function handleLogout() {
        AppAuth.logoutUser()
        setUserIsLoggedIn(false)
        setUserInfo({})
    }

    useEffect(() => {
        const userInfo = AppAuth.getUserInfo() 
        if(userInfo !== undefined) {
            setUserIsLoggedIn(true)
            setUserInfo(userInfo)
        }
    }, [])

    return(
        <div className="flex-col bg-app-primary h-screen w-36 sticky top-0">
            <div className="font-medium text-lg p-5">
                <img src={logo} alt="logo" />
            </div>
            <div className="mt-auto mb-0">
                {userInfo !== undefined && userInfo.username}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/signup')}>Sign Up</Button>}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/login')} >Log In</Button>}
                <Button intent="primary" size="medium" onClick={() => navigate('play')} >Solo</Button>
                {userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('versus')} >Versus</Button>}
                {userIsLoggedIn && <Button intent="primary" size="medium" onClick={handleLogout} >Log Out</Button>}
            </div>
        </div>
    )
}