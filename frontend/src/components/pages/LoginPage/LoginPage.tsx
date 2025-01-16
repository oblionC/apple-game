import { UserInput } from "../../UserInput"
import { Button } from "../../Button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppAuth } from "../../../utils/AppAuth"

export default function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    function handleLogin() {
        const requestOptions = {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email, 
                password: password
            })
        }
        fetch(import.meta.env.VITE_BACKEND_URL + '/users/login', requestOptions)
        .then(async (res) => {
            // backend returns emailError and passwordError
            const json = await res.json()
                
            setEmailError(json.emailError) 
            setPasswordError(json.passwordError)
            
            if(!json.error) {
                AppAuth.loginUser(json.userId, json.username, json.email, json.createdAt)
                navigate('/')
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