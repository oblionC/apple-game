import { Button } from "../Button"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { AppAuth } from "../../utils/AppAuth"
import { SidebarLogo } from "../SidebarLogo"
import userPlaceholder from '../../assets/user_placeholder.jpg'

function SidebarProfile({ userInfo }: { userInfo: any }) {
    return (
        <div className="w-full flex flex-col justify-center items-center mb-5">
            <div className="w-9/12 bg-app-tertiary rounded-lg p-3 overflow-x-visible">
                <div className="w-full aspect-square rounded-full overflow-hidden mb-2">
                   <img src={userPlaceholder} /> 
                </div>
                {userInfo.username}
            </div>
        </div>
    )
}

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