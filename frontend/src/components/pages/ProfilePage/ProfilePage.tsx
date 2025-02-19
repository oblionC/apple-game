import userPlaceholder from '../../../assets/user_placeholder.jpg'
import { HiOutlineStatusOnline } from "react-icons/hi";
import { FaRegCalendarPlus } from "react-icons/fa";
import { ScoreTab } from '../../ScoreTab';
import { useEffect, useState } from 'react'
import { AppAuth } from '../../../utils/AppAuth';
import { MatchHistoryTab } from '../../MatchHistoryTab';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment'

export default function ProfilePage() {
    const navigate = useNavigate()
    const routeParams = useParams()
    const scoreRowsState = useState<number>(15)
    const scoreColsState = useState<number>(15)
    const scoreDurationState = useState<number>(30)
    const [userInfo, setUserInfo] = useState<any>()

    useEffect(() => {
        if(routeParams && routeParams.username) {
            var url = new URL(import.meta.env.VITE_BACKEND_URL + "/users")
            url.searchParams.set("username", routeParams.username)

            var requestOptions = {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            }

            fetch(url, requestOptions)
            .then(async res => {
                console.log(res.status)
                if(res.status !== 200) {
                    var localUserInfo = AppAuth.getUserInfo()
                    if(!localUserInfo) {
                        navigate("/entry/login")
                    }
                    else {
                        setUserInfo(localUserInfo)
                        navigate("/profile")
                    }
                }
                var json = await res.json()
                setUserInfo(json)
            })
        }
        else {
            var localUserInfo = AppAuth.getUserInfo()
            if(!localUserInfo) {
                navigate("/entry/login")
            }
            else {
                setUserInfo(localUserInfo)
                navigate("/profile")
            }
        }
    }, [])


    return (
        <div className='overflow-auto w-full'>
            <div className="container min-h-0 min-w-0 mx-auto p-10 grid grid-rows-3 lg:grid-rows-2 gap-5 grid-cols-2 auto-row-auto auto-cols-auto">
                <div className="flex flex-row items-center justify-center p-5 bg-app-tertiary rounded-lg col-span-2">
                    <div className="m-5 aspect-square rounded-full overflow-hidden"> 
                        <img src={userPlaceholder} className='object-cover'/> 
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <span className='lg:text-[42px] md:text-[30px] text-[20px] font-bold'>{userInfo?.username}</span>
                        <div className="flex flex-row min-h-[100px] m-5 gap-5">
                            <div className='w-1/2 flex flex-col justify-center items-center bg-app-quaternary rounded-lg'>
                                <div className='w-full flex justify-center items-center my-2'>
                                    <FaRegCalendarPlus/>
                                </div>
                                {moment(new Date(userInfo?.createdAt)).format("MMM Do YY")} 
                            </div>
                            <div className='w-1/2 flex flex-col justify-center items-center bg-app-quaternary rounded-lg'>
                                <div className='w-full flex justify-center items-center my-2'>
                                    <HiOutlineStatusOnline/>
                                </div>
                                Online Now
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center h-auto p-5 bg-app-tertiaryrounded-lg col-span-2 lg:col-span-1 row-span-1">
                    <div className="w-full h-[500px] flex flex-col items-center justify-center ">
                        <div className='w-9/12 rounded-lg h-20 bg-app-quaternary flex justify-center items-center my-2'>
                            <span className='font-bold text-xl'>Solo Scores</span>
                        </div>
                        <ScoreTab userInfo={userInfo} rowsState={scoreRowsState} colsState={scoreColsState} durationState={scoreDurationState}/> 
                    </div>
                </div>
                <div className="flex flex-row items-center justify-center p-5 rounded-lg col-span-2 lg:col-span-1 row-span-1">
                    <div className="w-full h-[500px] flex flex-col items-center justify-center ">
                        <div className='w-9/12 rounded-lg h-20 bg-app-quaternary flex justify-center items-center my-2'>
                            <span className='font-bold text-xl'>Match History</span>
                        </div>
                        <MatchHistoryTab userInfo={userInfo} rowsState={scoreRowsState} colsState={scoreColsState} durationState={scoreDurationState} />
                    </div>
                </div>
            </div>
        </div>
    )
}