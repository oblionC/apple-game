import './App.css'
import { HomePage } from './components/pages/HomePage'
import { RootPage } from './components/pages/RootPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route path="play" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
