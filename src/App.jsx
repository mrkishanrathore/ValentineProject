import { useState, useEffect } from 'react'
import './App.css'
import MainScreen from './components/MainScreen'
import CelebrationScreen from './components/CelebrationScreen'
import SettingsModal from './components/SettingsModal'
import VideoModal from './components/VideoModal'

function App() {
  const [girlName, setGirlName] = useState('My Love')
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [noButtonScale, setNoButtonScale] = useState(1)
  const [yesButtonScale, setYesButtonScale] = useState(1)
  const [noClickCount, setNoClickCount] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  
  // Add your video URL here
  const videoUrl = 'https://example.com/your-video.mp4' // Change this to your video URL

  const minNoScale = 0.3
  const maxYesScale = 2
  const scaleDecrement = 0.15
  const scaleIncrement = 0.15

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const giftMessages = [
    "Are you sure?",
    "Are you sure?",
    "I have gifts for you 🎁",
    "We will hang out together 🎭",
    "I will buy you chocolates 🍫",
    "I will give you roses 🌹",
    "What if I give you a teddy? 🧸",
    // "I will take you to dinner 🍽️",
    // "We'll watch the sunset together 🌅",
    // "I'll hold your hand all day ❤️",
    // "You make me smile every day 😊",
    // "Please say YES! 💕",
    // "I promise to make you happy! 🌟",
    // "I can't imagine my life without you! 🌈",
    // "You are the best thing that ever happened to me! 💖",
    // "I will cherish you forever! 🌹",
    // "I want to create beautiful memories with you! 📸",
    // "You are my sunshine on a cloudy day! ☀️",
    "I will always be there for you! 🤗",
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
    const newMessageIndex = (messageIndex + 1) % giftMessages.length
    
    // Check if we've completed a full cycle (cycling back to 0)
    if (newMessageIndex === 0 && messageIndex !== 0) {
      setCycleCount((prev) => prev + 1)
      setShowVideoModal(true)
      // Reset scales for the next cycle
      setNoButtonScale(1)
      setYesButtonScale(1)
    } else {
      setNoClickCount((prev) => prev + 1)
      setMessageIndex(newMessageIndex)
      setNoButtonScale((prev) => Math.max(minNoScale, prev - scaleDecrement))
      setYesButtonScale((prev) => Math.min(maxYesScale, prev + scaleIncrement))
    }
  }

  const handleSaveName = (newName) => {
    if (newName && newName.trim()) {
      saveNameToFile(newName.trim())
      setShowSettingsModal(false)
    }
  }

  const handleVideoClose = () => {
    setShowVideoModal(false)
    // Reset for next cycle
    setMessageIndex(0)
    setNoClickCount(0)
  }

  return (
    <div className="app">
      <VideoModal 
        isOpen={showVideoModal}
        onClose={handleVideoClose}
        videoUrl={videoUrl}
      />
      
      {!showCelebration ? (
        <>
          <MainScreen 
            girlName={girlName}
            messageIndex={messageIndex}
            noButtonScale={noButtonScale}
            yesButtonScale={yesButtonScale}
            giftMessages={giftMessages}
            noClickCount={noClickCount}
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
