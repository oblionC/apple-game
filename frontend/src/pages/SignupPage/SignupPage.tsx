import { useState } from "react";
import { Button } from "../../components/Button";
import { UserInput } from "../../components/UserInput"
import { useLocation, useNavigate } from "react-router-dom";
import { AppAuth } from "../../components/../utils/AppAuth";
import RedirectState from "../../utils/RedirectState"


export default function SignupPage() {
    const location = useLocation()
    const redirect = (location.state as RedirectState).redirect
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    const [usernameError, setUsernameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")

    function handleSignup() {
        const requestOptions = {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email, 
                password: password
            })
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/users/new-user", requestOptions)
        .then(async (res) => {
            var json = await res.json()

            setUsernameError(json.usernameError)
            setPasswordError(json.passwordError)
            setEmailError(json.emailError)
            if(password !== confirmPassword) {
                setConfirmPasswordError("Passwords do not match!")
            }
            else {
                setConfirmPasswordError("")
            }

            // if no errors navigate to home page
            if(!json.error) {
                AppAuth.loginUser(json.userId, username, email, json.createdAt)
                navigate(redirect ? `${redirect}` : '/')
            }
        })
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <UserInput name="Username" error={usernameError} value={username} onChange={(e) => {setUsername(e.target.value)}} />
            <UserInput name="Email" error={emailError} value={email} onChange={(e) => {setEmail(e.target.value)}} />
            <UserInput type="password" name="Password" error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} />
            <UserInput type="password" name="Confirm Password" error={confirmPasswordError} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button intent="primary" size="large" onClick={handleSignup}>Sign Up</Button>
        </div>
    )
}