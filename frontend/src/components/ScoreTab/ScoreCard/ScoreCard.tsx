import moment from "moment"
import { AppAuth } from "../../../utils/AppAuth"

export default function ScoreCard({ position, score }: { position: number, score: any }) {
    console.log(score)
    return(
        <tr className="bg-app-tertiary h-20 rounded-lg border-1 overflow-hidden">
            <td className="first:rounded-l-lg overflow-hidden">
                #{position}
            </td>
            <td>
                {score.username}
            </td>
            <td>
                {score.score}
            </td>
            <td className="last:rounded-r-lg overflow-hidden">
                {moment(score.timeStamp).fromNow()}
            </td>
        </tr>
        // <tr className="w-9/12 h-20 my-2 bg-app-tertiary rounded-lg flex justify-evenly items-center">
        //     <td className={`w-10 h-10 flex justify-center items-center bg-yellow-300`}>
        //         #{position}
        //     </td>
        //     {score.userInfo?.username && (
        //         <td>
        //             {score.userInfo?.username}
        //         </td>
        //     )}
        //     <td>
        //         {score.score}
        //     </td>
        //     <td>
        //         {moment(score.timeStamp).fromNow()}
        //     </td>
        // </tr>
    )
}