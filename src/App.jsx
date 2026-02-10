import { useState, useEffect } from 'react'
import './App.css'
import MainScreen from './components/MainScreen'
import CelebrationScreen from './components/CelebrationScreen'
import SettingsModal from './components/SettingsModal'

function App() {
  const [girlName, setGirlName] = useState('My Love')
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [noButtonScale, setNoButtonScale] = useState(1)
  const [yesButtonScale, setYesButtonScale] = useState(1)

  const minNoScale = 0.3
  const maxYesScale = 2
  const scaleDecrement = 0.15
  const scaleIncrement = 0.15

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const giftMessages = [
    "Are you sure?",
    "Don't you want gifts?",
    "We will hang out together 🎭",
    "I will buy you chocolates 🍫",
    "I will give you roses 🌹",
    "I will take you to dinner 🍽️",
    "We'll watch the sunset together 🌅",
    "I'll hold your hand all day ❤️",
    "You make me smile every day 😊",
    "Please say YES! 💕",
    "I promise to make you happy! 🌟",
    "I can't imagine my life without you! 🌈",
    "You are the best thing that ever happened to me! 💖",
    "I will cherish you forever! 🌹",
    "I want to create beautiful memories with you! 📸",
    "You are my sunshine on a cloudy day! ☀️",
    "I will always be there for you! 🤗",
    "You are the love of my life! 💘",
    "Please give me a chance to make you happy! 🌟"
  ]

  // Load girlName from backend on mount
  useEffect(() => {
    loadNameFromFile()
  }, [])

  const loadNameFromFile = async () => {
    // Check if name is passed in URL
    const params = new URLSearchParams(window.location.search)
    const urlName = params.get('name')
    
    if (urlName) {
      setGirlName(decodeURIComponent(urlName))
      return
    }
    
    // Otherwise, load from file
    try {
      const response = await fetch('http://localhost:3000/api/name')
      if (response.ok) {
        const data = await response.json()
        setGirlName(data.name || 'My Love')
      }
    } catch (error) {
      console.log('Server not running, using default name:', error)
    }
  }

  const saveNameToFile = async (name) => {
    try {
      const response = await fetch('http://localhost:3000/api/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      const data = await response.json()
      if (data.success) {
        setGirlName(name)
        console.log('Name saved to variables.txt:', name)
      } else {
        console.error('Failed to save name:', data.error)
      }
    } catch (error) {
      console.error('Could not save to server:', error)
    }
  }

  const handleYes = () => {
    setShowCelebration(true)
  }

  const handleNo = () => {
    setMessageIndex((prev) => (prev + 1) % giftMessages.length)
    setNoButtonScale((prev) => Math.max(minNoScale, prev - scaleDecrement))
    setYesButtonScale((prev) => Math.min(maxYesScale, prev + scaleIncrement))
  }

  const handleSaveName = (newName) => {
    if (newName && newName.trim()) {
      saveNameToFile(newName.trim())
      setShowSettingsModal(false)
    }
  }

  return (
    <div className="app">
      {!showCelebration ? (
        <>
          <MainScreen 
            girlName={girlName}
            messageIndex={messageIndex}
            noButtonScale={noButtonScale}
            yesButtonScale={yesButtonScale}
            giftMessages={giftMessages}
            onYes={handleYes}
            onNo={handleNo}
            onSettings={() => setShowSettingsModal(true)}
          />
          <SettingsModal 
            isOpen={showSettingsModal}
            initialName={girlName}
            onSave={handleSaveName}
            onClose={() => setShowSettingsModal(false)}
          />
        </>
      ) : (
        <CelebrationScreen 
          girlName={girlName}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  )
}

export default App
