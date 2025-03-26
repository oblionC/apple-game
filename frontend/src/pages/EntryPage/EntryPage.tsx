import { Outlet } from "react-router-dom";
import { Logo } from "../../components/Logo";

export default function EntryPage() {
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