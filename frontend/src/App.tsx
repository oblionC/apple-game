import './App.css'
import { LandingPage } from './components/pages/LandingPage'
import { PlayPage } from './components/pages/PlayPage'
import { RootPage } from './components/pages/RootPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route index element={<LandingPage />} />
          <Route path="play" element={<PlayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
