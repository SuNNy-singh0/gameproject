import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GameLevel from './compoent/GameLevel'
import NeuralNexusChallenge from './compoent/NeuralNexusChallenge'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <GameLevel/> */}
   <NeuralNexusChallenge/>
    </>
  )
}

export default App
