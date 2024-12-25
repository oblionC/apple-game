import { useEffect, useRef, useState } from 'react'
import userPlaceholder from '../../assets/user_placeholder.jpg'
import { useNavigate } from 'react-router-dom'

export default function SidebarProfile({ userInfo }: { userInfo: any }) {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [height, setHeight] = useState<number>()
    const buttonRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        console.log(buttonRef.current?.scrollHeight)
        setHeight(buttonRef.current?.scrollHeight)
    }, [isOpen])

    function handleClick() {
        setIsOpen(o => !o)
    }

    return (
        <button className="transition-all ease-in-out duration-500 w-full flex flex-col items-center mb-5 overflow-hidden" style={{height: height}} onClick={handleClick}>
            <div ref={buttonRef} className="w-9/12 bg-app-tertiary rounded-lg overflow-hidden flex flex-col">
                {isOpen && (
                    <div className="transition-opacity ease-in-out duration-500 p-3">
                        <div className='w-full aspect-square flex justify-center items-center mb-2'>
                            <div className="transition-all ease-in-out duration-500 w-[90%] hover:w-full aspect-square rounded-full overflow-hidden bg-black">
                                <img src={userPlaceholder} onClick={() => navigate("profile")}/> 
                            </div>
                        </div>
                        <span className='text-sm'>
                            {userInfo.username}
                        </span>
                    </div>
                )}
                {!isOpen && (
                    <div className="transition-opacity ease-in-out duration-500 p-2" style={{opacity: isOpen ? 0 : 1}}>
                        Profile
                    </div>
                )}
            </div>
        </button>
    )
}