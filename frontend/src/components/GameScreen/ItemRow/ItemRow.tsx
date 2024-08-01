import { Item } from '../Item'
import { ITEM_GAP } from '../constants'

export default function ItemRow({ rowNumber, itemValues }: { rowNumber: number, itemValues: any } ) {
    const items = []
    for(let i = 0; i < itemValues.length; i++) {
        items.push()
    }
    return(
        <>
            {itemValues.map((item: any) => {
                return <Item itemInfo={item} />
            })}
        </>
    )
}