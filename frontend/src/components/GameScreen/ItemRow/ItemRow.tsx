import { Item } from '../Item'
import { ITEM_GAP } from '../constants'

export default function ItemRow({ rowNumber, itemValues }: { rowNumber: number, itemValues: number[] } ) {
    console.log("rerender")
    const items = []
    for(let i = 0; i < itemValues.length; i++) {
        items.push(<Item x={i * ITEM_GAP} y={rowNumber * ITEM_GAP} itemValue={itemValues[i]} />)
    }
    return(
        <>
            {items}
        </>
    )
}