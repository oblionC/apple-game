export default class ScoreHandler {
    setScore: Function;

    constructor(setScore: Function) {
        this.setScore = setScore;
    }

    addScore(selectedItems: any) {
        this.setScore((score: number) => score + selectedItems.length)
    }
}