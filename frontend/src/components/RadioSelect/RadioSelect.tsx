import { OptionButton } from "../OptionButton";

export default function RadioSelect({ list, valueState, unit }: { list: any, valueState: [number, Function], unit: string }) {
    let count = 0 
    return(
        <div className="grid w-9/12 grid-cols-3 gap-x-2 gap-y-2 justify-center items-center mb-2 last:mb-0">
            {
                list.map((x: number) => {
                    count += 1;
                    return <OptionButton key={count} value={x} valueState={valueState} unit={unit} />
                })
            }
        </div>
    )
}