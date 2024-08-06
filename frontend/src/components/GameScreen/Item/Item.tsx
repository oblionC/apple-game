import { Rect, Text} from 'react-konva'

function ActiveItem({ itemInfo, itemSize }: {itemInfo: any, itemSize: number}) {
    return(
        <>
            <Rect x={itemInfo.x} y={itemInfo.y} width={itemSize} height={itemSize} fill={itemInfo.selected ? 'blue': 'grey'} />
            <Text text={`${itemInfo.value}`} x={itemInfo.x} y={itemInfo.y} width={itemSize} height={itemSize} verticalAlign='middle' align='center' fontSize={20} />
        </>
    )
}

export default function Item({ itemInfo, itemSize }: { itemInfo: any, itemSize: number }) {
    if(itemInfo === undefined) return <></>
    return(
        <ActiveItem itemInfo={itemInfo} itemSize={itemSize} />
    )
}