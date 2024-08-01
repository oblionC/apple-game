import { Rect, Text} from 'react-konva'
import { ITEM_SIZE } from '../constants'

export default function Item({ x, y, itemValue }: {x: number, y: number, itemValue: number}) {
    return(
        <>
            <Rect x={x} y={y} width={ITEM_SIZE} height={ITEM_SIZE} fill='yellow' value={itemValue} />
            <Text text={`${itemValue}`} x={x + Math.floor(ITEM_SIZE/2)} y={y + Math.floor(ITEM_SIZE/2)} />
        </>
    )
}