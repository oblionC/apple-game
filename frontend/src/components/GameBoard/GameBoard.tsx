import styles from './GameBoard.module.css'

export default function GameBoard() {
    return (
        <>
            <div className={styles.gameScreen}>
                <div className={styles.gameBoard}>
                    This is a gameboard
                </div>
            </div>
        </>
    )
}