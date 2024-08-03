import { Item } from '../Item'
import { ITEM_GAP } from '../constants'

export default function ItemRow({ itemValues }: { itemValues: any } ) {
    return(
        <>
            {itemValues.map((item: any) => {
                return <Item itemInfo={item} />
            })}
        </>
    )
}