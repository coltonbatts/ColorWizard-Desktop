import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')
  const [appInfo, setAppInfo] = useState<any>(null)
  const [clickCount, setClickCount] = useState(0)
  const [color, setColor] = useState('#667eea')

  useEffect(() => {
    // Load app info on mount
    invoke('get_app_info').then(setAppInfo).catch(console.error)
  }, [])

  async function handleGreet() {
    if (!name.trim()) return
    const result = await invoke('greet', { name })
    setGreeting(result as string)
    setClickCount(c => c + 1)
  }

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0'
  ]

  function changeColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setColor(randomColor)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 transition-colors duration-300"
      style={{ backgroundColor: color + '20' }}
    >
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold" style={{ color }}>
            🚀 Tauri Demo
          </h1>
          {appInfo && (
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>App:</strong> {appInfo.name}</p>
              <p><strong>Version:</strong> {appInfo.version}</p>
              <p><strong>Platform:</strong> {appInfo.platform}</p>
            </div>
          )}
        </div>

        {/* Interactive Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Interactive Demo
          </h2>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter your name:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGreet()}
                placeholder="Type your name here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGreet}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Greet Me! 👋
              </button>
            </div>
          </div>

          {/* Greeting Display */}
          {greeting && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-lg text-blue-900">{greeting}</p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              <strong>Greetings sent:</strong> {clickCount}
            </div>
            <button
              onClick={changeColor}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              🎨 Change Theme
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">✨ What's Happening?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ <strong>React UI</strong> - Beautiful, responsive interface</li>
            <li>✅ <strong>Rust Backend</strong> - Fast, secure commands</li>
            <li>✅ <strong>Type-Safe IPC</strong> - Seamless communication</li>
            <li>✅ <strong>Hot Reload</strong> - Instant updates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
