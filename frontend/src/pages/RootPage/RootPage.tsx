import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";

export default function RootPage() {
    
    return (
        <>
            <div className="w-screen h-screen flex flex-row">
                <Sidebar /> 
                <div className="bg-app-secondary w-full flex grow overflow-auto">
                    <Outlet />
                </div>
            </div>
        </>
    )
}