import { useState } from "react";
import { Button } from "../../Button";
import { UserInput } from "../../UserInput"
import logo from "../../../assets/logo.png"
import { useNavigate } from "react-router-dom";


export default function SignupPage() {
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
            headers: { 'Content-Type': 'application/json' },
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
                localStorage.setItem('applegame-user', JSON.stringify({
                    username: username,
                    email: email
                }))
                navigate('/')
            }
        })
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <img src={logo} className="w-1/3" /> 
            <UserInput name="Username" error={usernameError} value={username} onChange={(e) => {setUsername(e.target.value)}} />
            <UserInput name="Email" error={emailError} value={email} onChange={(e) => {setEmail(e.target.value)}} />
            <UserInput type="password" name="Password" error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} />
            <UserInput type="password" name="Confirm Password" error={confirmPasswordError} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <Button intent="primary" size="large" onClick={handleSignup}>Sign Up</Button>
        </div>
    )
}