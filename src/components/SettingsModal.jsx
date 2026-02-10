import { useState } from 'react'
import './SettingsModal.css'

function SettingsModal({ isOpen, initialName, onSave, onClose }) {
  const [nameInput, setNameInput] = useState(initialName)

  const handleSave = () => {
    onSave(nameInput)
    setNameInput(initialName)
  }

  const handleCancel = () => {
    setNameInput(initialName)
    onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        <div className="form-group">
          <label htmlFor="nameInput">Girlfriend's Name:</label>
          <input
            id="nameInput"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
