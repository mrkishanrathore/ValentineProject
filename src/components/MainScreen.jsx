import { useEffect, useRef } from 'react'
import './MainScreen.css'

function MainScreen({
  girlName,
  messageIndex,
  noButtonScale,
  yesButtonScale,
  giftMessages,
  noClickCount,
  onYes,
  onNo,
  onSettings
}) {
  const questionRef = useRef(null)
  const noButtonRef = useRef(null)
  const yesButtonRef = useRef(null)

  const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0))
  }

  useEffect(() => {
    if (!isTouchDevice()) {
      const noBtn = noButtonRef.current
      if (noBtn) {
        noBtn.addEventListener('mouseenter', handleNoHover)
        return () => {
          noBtn.removeEventListener('mouseenter', handleNoHover)
        }
      }
    }
  }, [messageIndex])

  const handleNoHover = () => {
    if (messageIndex > 0) {
      moveNoButton()
    }
  }

  const moveNoButton = () => {
    if (!noButtonRef.current) return

    const padding = 20
    const rect = noButtonRef.current.getBoundingClientRect()
    const maxX = window.innerWidth - rect.width - padding
    const maxY = window.innerHeight - rect.height - padding

    const x = Math.max(padding, Math.random() * maxX)
    const y = Math.max(padding, Math.random() * maxY)

    noButtonRef.current.style.position = 'fixed'
    noButtonRef.current.style.left = x + 'px'
    noButtonRef.current.style.top = y + 'px'
  }

  const handleNoClick = () => {
    onNo()
    // After 5 clicks, move the button on every click
    if (noClickCount >= 5) {
      moveNoButton()
    }
    if (questionRef.current) {
      questionRef.current.style.animation = 'none'
      setTimeout(() => {
        if (questionRef.current) {
          questionRef.current.style.animation = 'slideInDown 0.5s ease-in'
        }
      }, 10)
    }
  }

  const currentMessage = messageIndex === 0 
    ? ` ${girlName}, Will you be My Valentine?`
    : giftMessages[messageIndex]

  return (
    <div className="main-screen">
      <div className="settings-btn-container">
        <button className="settings-btn" onClick={onSettings} aria-label="Settings">
          ⚙️
        </button>
      </div>

      <div className="question-container">
        <h1 ref={questionRef} className="main-question">
          {currentMessage}
        </h1>
      </div>

      <div className="buttons-container">
        <div className="button-wrapper">
          <button
            ref={yesButtonRef}
            className="yes-btn"
            onClick={onYes}
            style={{ transform: `scale(${yesButtonScale})` }}
          >
            YES ❤️
          </button>
        </div>

        <div className="button-wrapper">
          <button
            ref={noButtonRef}
            className="no-btn"
            onClick={handleNoClick}
            style={{ 
              transform: `scale(${noButtonScale})`,
              position: 'relative'
            }}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainScreen
