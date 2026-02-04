import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 300) // Wait for fade out animation
    }, 1500) // Show splash for 1.5 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <div className="text-8xl font-bold text-black">CB</div>
      </div>
    </div>
  )
}
