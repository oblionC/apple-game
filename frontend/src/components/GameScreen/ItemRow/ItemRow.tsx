import { Item } from '../Item'

export default function ItemRow({ itemValues, itemSize }: { itemValues: any, itemSize: number } ) {
    return(
        <>
            {itemValues.map((item: any) => {
                return <Item itemInfo={item} itemSize={itemSize} />
            })}
        </>
    )
}