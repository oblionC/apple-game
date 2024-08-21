import './App.css'
import { PlayPage } from './components/pages/PlayPage'
import { RootPage } from './components/pages/RootPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route path="play" element={<PlayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
