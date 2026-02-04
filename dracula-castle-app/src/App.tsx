import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import CastleImage from './dracula-castle.png'

interface Window {
  id: number
  x: number
  y: number
  width: number
  height: number
  lit: boolean
  message: string
}

function App() {
  const [windows, setWindows] = useState<Window[]>([
    { id: 1, x: 15, y: 25, width: 8, height: 10, lit: false, message: "The Count's Library - Ancient tomes line the walls" },
    { id: 2, x: 28, y: 20, width: 8, height: 10, lit: false, message: "The Dining Hall - A long table set for eternity" },
    { id: 3, x: 42, y: 30, width: 8, height: 10, lit: false, message: "The Tower Room - Where Dracula watches the night" },
    { id: 4, x: 18, y: 45, width: 8, height: 10, lit: false, message: "The Crypt - Resting place of the undead" },
    { id: 5, x: 35, y: 50, width: 8, height: 10, lit: false, message: "The Laboratory - Alchemical experiments await" },
    { id: 6, x: 50, y: 25, width: 8, height: 10, lit: false, message: "The Guest Chamber - No one sleeps here twice" },
  ])

  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null)
  const [showMessage, setShowMessage] = useState(false)

  const handleWindowClick = (window: Window) => {
    // Toggle window light
    setWindows(prev => 
      prev.map(w => 
        w.id === window.id ? { ...w, lit: !w.lit } : w
      )
    )
    
    // Show message
    setSelectedWindow(window)
    setShowMessage(true)
    
    // Play sound effect (optional - can add later)
    invoke('window_clicked', { windowId: window.id })
      .catch(console.error)
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Castle Image Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={CastleImage} 
          alt="Dracula's Castle" 
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
        
        {/* Clickable Windows Overlay */}
        {windows.map((window) => (
          <div
            key={window.id}
            onClick={() => handleWindowClick(window)}
            className={`absolute cursor-pointer transition-all duration-300 ${
              window.lit 
                ? 'bg-yellow-400 bg-opacity-40 shadow-[0_0_20px_rgba(255,255,0,0.6)]' 
                : 'bg-transparent hover:bg-red-900 hover:bg-opacity-20'
            }`}
            style={{
              left: `${window.x}%`,
              top: `${window.y}%`,
              width: `${window.width}%`,
              height: `${window.height}%`,
            }}
            title={`Window ${window.id} - Click to light up!`}
          >
            {window.lit && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message Display */}
      {showMessage && selectedWindow && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-red-800 animate-fade-in">
          <div className="text-xl font-bold mb-2 text-red-400">
            🏰 Window {selectedWindow.id}
          </div>
          <div className="text-sm">
            {selectedWindow.message}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
        🦇 Click the windows to light them up!
      </div>

      {/* Window Counter */}
      <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
        Lit Windows: {windows.filter(w => w.lit).length} / {windows.length}
      </div>
    </div>
  )
}

export default App
