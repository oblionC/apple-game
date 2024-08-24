export default class ScoreHandler {
    setScore: Function | undefined;

    constructor(setScore: Function | undefined ) {
        this.setScore = setScore;
    }

    addScore(selectedItems: any) {
        if(this.setScore === undefined) return 
        this.setScore((score: number) => score + selectedItems.length)
    }
}