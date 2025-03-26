import { useEffect, useMemo, useState } from "react";
import { DropdownButton } from "../../components/DropdownButton";
import { RadioSelect } from "../../components/RadioSelect";
import { DURATION_OPTIONS, ROWS_OPTIONS, COLS_OPTIONS } from "../../components/../constants/gameOptions"; 
import { DURATION_UNIT, ROWS_UNIT, COLS_UNIT } from "../../components/../constants/optionUnits";
import { Button } from "../../components/Button";
import { ScoreCard } from "../../components/ScoreTab/ScoreCard";
import { ScoreCardContainer } from "../../components/ScoreTab/ScoreCardContainer";

export default function LeaderboardsPage() {
    const rowsState = useState<number>(15)
    const colsState = useState<number>(15)
    const durationState = useState<number>(30)
    const [option, setOption] = useState("all")
    const [scores, setScores] = useState([])
    const scoreCards = useMemo(() => {
        var position = 0
        return scores.map(score => {
            position += 1
            return <ScoreCard position={position} score={score} />
        }
    )}, [scores])

    useEffect(() => {
        var url = new URL(import.meta.env.VITE_BACKEND_URL + "/globalbests/" + option)
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
            setScores(json)
        })
    }, [option, rowsState[0], colsState[0], durationState[0]])

    return (
        <div className="w-full flex justify-center pt-10">
            <div className="h-full container justify-center rounded-lg overflow-auto no-scrollbar">
                <div>
                    <DropdownButton value={durationState[0]} unit={DURATION_UNIT}>
                        <RadioSelect list={DURATION_OPTIONS} valueState={durationState} unit={DURATION_UNIT} />
                    </DropdownButton>
                    <DropdownButton value={rowsState[0]} unit={ROWS_UNIT}>
                        <RadioSelect list={ROWS_OPTIONS} valueState={rowsState} unit={ROWS_UNIT}/>
                    </DropdownButton>
                    <DropdownButton value={colsState[0]} unit={COLS_UNIT}>
                        <RadioSelect list={COLS_OPTIONS} valueState={colsState} unit={COLS_UNIT} />
                    </DropdownButton>
                    <div className="flex justify-center">
                        <div className="w-9/12 flex items-center justify-center min-h-[50px] my-3">
                            <Button intent="secondary" border={option === "all" ? "white" : "none"} className="basis-1/2 h-full rounded-lg mr-1" onClick={() => setOption("all")}>
                                All 
                            </Button>
                            <Button intent="secondary" border={option === "uniqueusers" ? "white" : "none"} className="basis-1/2 h-full rounded-lg ml-1 min-w-fit" onClick={() => setOption("uniqueusers")}>
                                Users 
                            </Button>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <ScoreCardContainer>
                            {scoreCards}
                        </ScoreCardContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}