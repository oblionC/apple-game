import { Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../Logo";

export default function EntryPage() {
    const navigate = useNavigate()

    return(
        <>
            <div className="flex justify-center items-center w-full h-screen bg-app-primary">
                <div className="max-w-[35rem] min-h-[45rem] bg-app-secondary rounded-lg shadow-2xl flex flex-col justify-center align-center"> 
                    <Logo />
                    <Outlet />
                </div>
            </div>
        </>
    )
}