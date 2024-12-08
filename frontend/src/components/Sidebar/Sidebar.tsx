import { Button } from "../Button"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { AppAuth } from "../../utils/AppAuth"
import { SidebarLogo } from "../SidebarLogo"
import { SidebarProfile } from "../SidebarProfile"


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
            <SidebarLogo /> 
            <div className="mt-auto mb-0">
                {userIsLoggedIn && <SidebarProfile userInfo={userInfo} />}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/signup')}>Sign Up</Button>}
                {!userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('entry/login')} >Log In</Button>}
                <Button intent="primary" size="medium" onClick={() => navigate('play')} >Solo</Button>
                {userIsLoggedIn && <Button intent="primary" size="medium" onClick={() => navigate('versus')} >Versus</Button>}
                {userIsLoggedIn && <Button intent="primary" size="medium" onClick={handleLogout} >Log Out</Button>}
            </div>
        </div>
    )
}