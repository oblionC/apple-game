import { ScoreCard } from "./ScoreCard"
import { useEffect, useState } from "react"
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../constants/gameOptions"
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../constants/optionUnits"
import { RadioSelect } from "../RadioSelect"
import { ScoreCardContainer } from "./ScoreCardContainer"

function generateScoreCards(scores: any) {
    var position = 0
    return scores.map((score: number) => {
        console.log(score)
        position += 1  
        return (
            <ScoreCard key={position} position={position} score={score} />
        )
    })
}

export default function ScoreTab({ userInfo, rowsState, colsState, durationState }: { userInfo: any, rowsState: [number, Function], colsState: [number, Function], durationState: [number, Function] }) {
    const [scores, setScores] = useState([])

    useEffect(function getScores() {
        var url = new URL(import.meta.env.VITE_BACKEND_URL + "/scores/user-bests")
        console.log(userInfo)
        if(userInfo !== undefined) {
            url.searchParams.set('userId', userInfo.userId)
            url.searchParams.set('rows', String(rowsState[0]))
            url.searchParams.set('cols', String(colsState[0]))
            url.searchParams.set('duration', String(durationState[0]))

            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "applicaton/json" },
            }
            fetch(url, requestOptions)
            .then(async (res) => {
                var json = await res.json()
                setScores(json.scores)
            })
        }
    }, [rowsState[0], colsState[0], durationState[0], userInfo])
    return (
        <div className="w-full h-full flex flex-col overflow-auto no-scrollbar">
            <div className="w-full flex flex-col items-center justify-center my-2">
                <RadioSelect list={DURATION_OPTIONS} valueState={durationState} unit={DURATION_UNIT} /> 
                <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT} /> 
                <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} /> 
            </div>
            <div className="w-full flex flex-col items-center justify-center py-2">
                <ScoreCardContainer>
                    {generateScoreCards(scores)}
                </ScoreCardContainer>
            </div>
        </div>
    )
}