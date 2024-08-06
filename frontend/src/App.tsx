import { GameScreen } from './components/GameScreen'
import './App.css'
import { useEffect } from 'react'
import { GAMEBOARD_HEIGHT, GAMEBOARD_WIDTH } from './components/GameScreen/constants'

function App() {
  return (
    <>
      <GameScreen width={GAMEBOARD_WIDTH} height={GAMEBOARD_HEIGHT}/>
    </>
  )
}

export default App
