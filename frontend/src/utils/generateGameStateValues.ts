export default function generateGameStateValues(rows: number, cols: number) {
    // Creates a matrix of values 

    let result: any = []
    for(let i = 0; i < rows; i++) {
        result.push([])
        for(let j = 0; j < cols; j++) {
            result[i].push((Math.floor(Math.random() * (10 - 1))) + 1)
        }
    }
    return result
}