import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'

function App() {
  const [greetMsg, setGreetMsg] = useState('')
  const [name, setName] = useState('')

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }))
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Tauri!</h1>

      <div className="space-y-4">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
            className="px-4 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={() => greet()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Greet
          </button>
        </div>

        <p className="text-lg">{greetMsg}</p>
      </div>
    </div>
  )
}

export default App
