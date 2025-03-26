import './App.css'
import { LandingPage } from './pages/LandingPage'
import { PlayPage } from './pages/PlayPage'
import { RootPage } from './pages/RootPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage/SignupPage'
import { EntryPage } from './pages/EntryPage'
import { LoginPage } from './pages/LoginPage'
import { VersusPage } from './pages/VersusPage'
import { ProfilePage } from './pages/ProfilePage'
import { LeaderboardsPage } from './pages/LeaderboardsPage'
import { MatchRoomsPage } from './pages/MatchRoomsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootPage />}>
          <Route index element={<LandingPage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="versus" element={<VersusPage />} />
          <Route path="leaderboards" element={<LeaderboardsPage/>} />
          <Route path="matchrooms" element={<MatchRoomsPage />} />
        </Route>
        <Route path="entry" element={<EntryPage />}>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
