import { Button } from "../Button"

export default function OptionButton({value, valueState, unit}: {value: number, valueState: [number, Function], unit: string}) {
    const [activeValue, setActiveValue] = valueState

    return(
            <Button intent="secondary" size="full" border={activeValue === value ? "white" : "none"} value={value}  onClick={(e: any) => {setActiveValue(+e.target.value)}}>
                {value} {unit}
            </Button>
    )
}