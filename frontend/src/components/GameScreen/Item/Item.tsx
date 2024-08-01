import { Rect, Text} from 'react-konva'
import { ITEM_SIZE } from '../constants'

function ActiveItem({ itemInfo }: {itemInfo: any}) {
    return(
        <>
            <Rect x={itemInfo.x} y={itemInfo.y} width={ITEM_SIZE} height={ITEM_SIZE} fill={itemInfo.selected ? 'blue': 'yellow'} />
            <Text text={`${itemInfo.value}`} x={itemInfo.x} y={itemInfo.y} width={ITEM_SIZE} height={ITEM_SIZE} verticalAlign='middle' align='center' fontSize={20} />
        </>
    )
}

export default function Item({ itemInfo }: { itemInfo: any }) {
    if(itemInfo === undefined) return <></>
    return(
        <ActiveItem itemInfo={itemInfo} />
    )
}