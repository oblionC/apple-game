import './App.css'
import { LandingPage } from './components/pages/LandingPage'
import { PlayPage } from './components/pages/PlayPage'
import { RootPage } from './components/pages/RootPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignupPage from './components/pages/SignupPage/SignupPage'
import { EntryPage } from './components/pages/EntryPage'
import { LoginPage } from './components/pages/LoginPage'
import { VersusPage } from './components/pages/VersusPage'
import { ProfilePage } from './components/pages/ProfilePage'
import { LeaderboardsPage } from './components/pages/LeaderboardsPage'
import { MatchRoomsPage } from './components/pages/MatchRoomsPage'

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
