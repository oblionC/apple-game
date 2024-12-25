export default function countGameStateScore(gamestate: any) {
    var count = 0
    for(var row of gamestate) {
        for(var item of row) {
            if(!item) count += 1 
        }
    }
    return count
}