import './App.css'
import DesertAdventure from './compoent/DesertAdventure'
import DesertAdventureGame from './compoent/DesertAdventureGame'
import GameLevel from './compoent/GameLevel'
import NeuralNexusChallenge from './compoent/NeuralNexusChallenge'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<NeuralNexusChallenge />} />
        <Route path="/play" element={<GameLevel />} /> */}
        <Route path="/" element={<DesertAdventure/>} />
        <Route path="/newgame" element={<DesertAdventureGame/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
