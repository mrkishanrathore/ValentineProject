import { useEffect, useRef } from 'react'
import './VideoModal.css'

function VideoModal({ isOpen, onClose, videoUrl }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play()
      // Request fullscreen
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen()
      }
    }
  }, [isOpen])

  const handleVideoEnded = () => {
    onClose()
  }

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="video-modal-overlay">
      <div className="video-modal-container">
        <button className="video-modal-close" onClick={handleClose}>✕</button>
        <video
          ref={videoRef}
          controls
          autoPlay
          onEnded={handleVideoEnded}
          className="video-modal-video"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default VideoModal
