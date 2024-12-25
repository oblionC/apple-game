import { COLS_UNIT, DURATION_UNIT, ROWS_UNIT } from "../../../constants/optionUnits"
import moment from 'moment'

export default function MatchCard({ match }: { match: any }) {

    return(
        <div className="w-9/12 h-20 my-2 bg-app-tertiary rounded-lg flex justify-evenly items-center">
            <div className="flex flex-col justify-center">
                <div>
                    {match.rows} {ROWS_UNIT}
                </div>
                <div>
                    {match.cols} {COLS_UNIT}
                </div>
                <div>
                    {match.duration} {DURATION_UNIT}
                </div>
            </div>
            <div className="flex flex-col justify-center">
                {match.usernames?.map((username: String, index: number) => {
                    return (
                        <span key={index}>
                            {username}
                        </span>
                    )
                })}
            </div>
            <div className="flex flex-col justify-center">
                {match.scores?.map((score: String, index: number) => {
                    return (
                        <span key={index}>
                            {score}
                        </span>
                    )
                })}
            </div>
            <div>
                {moment(match.timeStamp).fromNow()}
            </div>
        </div>
    )
}