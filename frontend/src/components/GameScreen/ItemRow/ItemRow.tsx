import { Item } from '../Item'

export default function ItemRow({ itemValues, itemSize }: { itemValues: any, itemSize: number } ) {
    if(!itemValues) return <></>
    return(
        <>
            {itemValues.map((item: any) => {
                if(!item) return 
                return <Item key={item.id} itemInfo={item} itemSize={itemSize} />
            })}
        </>
    )
}