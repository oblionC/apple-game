import { Item } from '../Item'
import { ITEM_GAP } from '../constants'

export default function ItemRow({ rowNumber, itemCount, itemValues }: { rowNumber: number, itemCount: number, itemValues: number[] } ) {
    const items = []
    for(let i = 0; i < itemCount; i++) {
        items.push(<Item x={i * ITEM_GAP} y={rowNumber * ITEM_GAP} itemValue={itemValues[i]} />)
    }
    return(
        <>
            {items}
        </>
    )
}