import { useEffect, useRef, useState } from 'react'
import './CelebrationScreen.css'

function CelebrationScreen({ girlName, reduceMotion }) {
  const canvasRef = useRef(null)
  const [showSecondStage, setShowSecondStage] = useState(false)
  const [showCallMessage, setShowCallMessage] = useState(false)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext('2d')

    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 8
        this.vy = (Math.random() - 0.5) * 8 - 2
        this.life = 1
        this.decay = Math.random() * 0.015 + 0.01
        this.color = ['#ff1744', '#ff5252', '#ffeb3b', '#00ff00', '#00bfff', '#ff69b4'][Math.floor(Math.random() * 6)]
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.1
        this.life -= this.decay
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.life
        ctx.fillRect(this.x, this.y, 4, 4)
        ctx.globalAlpha = 1
      }
    }

    const createFireworks = (x, y) => {
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push(new Particle(x, y))
      }
    }

    const animateFireworks = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        particlesRef.current[i].update()
        particlesRef.current[i].draw()

        if (particlesRef.current[i].life <= 0) {
          particlesRef.current.splice(i, 1)
        }
      }

      if (particlesRef.current.length > 0) {
        requestAnimationFrame(animateFireworks)
      }
    }

    const playSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 400
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    // Start fireworks
    if (!reduceMotion) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          const x = Math.random() * canvas.width
          const y = Math.random() * canvas.height * 0.5
          createFireworks(x, y)
          animateFireworks()
        }, i * 220)
      }
      playSound()
    } else {
      playSound()
    }

    // Reveal second stage
    const revealDelay = reduceMotion ? 600 : 2200
    const timeout = setTimeout(() => {
      setShowSecondStage(true)
    }, revealDelay)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [reduceMotion])

  const handleRevealMore = () => {
    setShowCallMessage(true)
  }

  return (
    <div className="celebration-screen">
      <canvas ref={canvasRef} className="fireworks-canvas"></canvas>

      <div className="celebration-content">
        <h1 className="congrats-message">YES, {girlName}! 🎉</h1>
        <p className="love-message">So… when do I finally get to see you?</p>

        {showSecondStage && (
          <div className="second-stage">
            {!showCallMessage ? (
              <>
                <h2>💕 A Special Plan for Us</h2>
                <p className="plan-text">
                  We'll go for a movie together 🎬😌
                  {/* Here's a little plan for us, {girlName}: a walk by the river, cozy dinner, and a surprise under the stars. */}
                </p>
                <button className="reveal-more-btn" onClick={handleRevealMore}>
                  Reveal More
                </button>
              </>
            ) : (
              <>
                <h2>One Last Thing 💖</h2>
                <p className="plan-text">
                  So… what do you think? 🤔
                </p>
                <p style={{ fontSize: '1.3rem', marginTop: '20px' }}>I am looking forward to our time together!</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CelebrationScreen
