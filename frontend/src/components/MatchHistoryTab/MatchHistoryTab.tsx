import { MatchCard } from "./MatchCard"
import { useEffect, useRef, useState } from "react"
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../constants/gameOptions"
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../constants/optionUnits"
import { RadioSelect } from "../RadioSelect"
import { Button } from "../Button"

type MatchHistoryProps = { 
    userInfo: any, 
    rowsState: [number, Function], 
    colsState: [number, Function], 
    durationState: [number, Function],
}

function generateMatchCards(matches: unknown) {
    var position = 0
    return matches.map((match) => {
        position += 1  
        return (
            <MatchCard key={position} position={position} match={match} />
        )
    })
}

function RecentMatchHistory({userInfo}: {userInfo: any}) {
    const [matches, setMatches] = useState([])
    useEffect(function getCategorizedMatches() {
        var url = new URL(import.meta.env.VITE_BACKEND_URL + "/matchInfo/recentMatches")
        if(userInfo !== undefined) {
            url.searchParams.set('userId', userInfo.userId)

            const requestOptions = {
                method: "GET",
                headers: { "Content-Type": "applicaton/json" },
            }
            fetch(url, requestOptions)
            .then(async (res) => {
                var json = await res.json()
                setMatches(json)
            })
        }
    }, [])

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center py-2">
                {
                    matches && (
                        <>
                            {generateMatchCards(matches)}
                        </>
                    )
                }
            </div>
        </>
    )

}

function CategorizedMatchHistory({ userInfo, rowsState, colsState, durationState}: MatchHistoryProps ) {
    const [matches, setMatches] = useState([])

    useEffect(function getCategorizedMatches() {
        var url = new URL(import.meta.env.VITE_BACKEND_URL + "/matchInfo/filteredMatches")
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
                setMatches(json)
            })
        }
    }, [rowsState[0], colsState[0], durationState[0]])

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <RadioSelect list={DURATION_OPTIONS} valueState={durationState} unit={DURATION_UNIT} /> 
                <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT} /> 
                <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} /> 
            </div>
            <div className="w-full flex flex-col items-center justify-center py-2">
                {
                    matches && (
                        <>
                            {generateMatchCards(matches)}
                        </>
                    )
                }
            </div>
        </>
    )
}

export default function MatchHistoryTab({ userInfo, rowsState, colsState, durationState }: MatchHistoryProps) {
    const [categorized, setCategorized] = useState(false)

    return (
        <div className="w-full h-full flex flex-col items-center overflow-auto no-scrollbar">
            <div className="w-9/12 flex items-center justify-center min-h-[50px] my-3">
                <Button intent="secondary" border={categorized ? "none" : "white"} className="basis-1/2 h-full rounded-lg mr-1" onClick={() => setCategorized(false)}>
                    Recent 
                </Button>
                <Button intent="secondary" border={categorized ? "white" : "none"} className="basis-1/2 h-full rounded-lg ml-1 min-w-fit" onClick={() => setCategorized(true)}>
                    Categorized
                </Button>
            </div>
            {!categorized && (
                <RecentMatchHistory userInfo={userInfo}/>
            )}
            {categorized && (
                <CategorizedMatchHistory userInfo={userInfo} rowsState={rowsState} colsState={colsState} durationState={durationState} />
            )}
        </div>
    )
}