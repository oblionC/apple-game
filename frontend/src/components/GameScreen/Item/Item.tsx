import { Rect, Text} from 'react-konva'


function ActiveItem({ itemInfo, itemSize }: {itemInfo: any, itemSize: number}) {
    return(
        <>
            {/* Color comes from the tailwind config file (quaternary) */}
            <Rect x={itemInfo.x} y={itemInfo.y} width={itemSize} height={itemSize} fill={itemInfo.selected ? 'blue': '#F6B17A'} />
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