import { UserInput } from "../../components/UserInput"
import { Button } from "../../components/Button"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AppAuth } from "../../components/../utils/AppAuth"
import RedirectState from "../../utils/RedirectState"

export default function LoginPage() {
    const navigate = useNavigate()
    const redirect = (useLocation().state as RedirectState)?.redirect
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    function handleLogin() {
        const requestOptions: RequestInit = {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email, 
                password: password
            }),
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/users/login', requestOptions)
        .then(async (res) => {
            const json = await res.json()

            setEmailError(json.emailError) 
            setPasswordError(json.passwordError)
            
            if(!json.error && res.status === 200) {
                AppAuth.storeToken(json.accessToken)
                AppAuth.loginUser(json.userId, json.username, json.email, json.createdAt)
                navigate(redirect ? `${redirect}` : '/')
            }
        })
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <UserInput name="Email" error={emailError} value={email} onChange={(e: any) => {setEmail(e.target.value)}} />
            <UserInput type="password" name="Password" error={passwordError} value={password} onChange={(e: any) => setPassword(e.target.value)} />
            <Button intent="primary" size="large" onClick={handleLogin}>Log In</Button>
        </div>
    )
}