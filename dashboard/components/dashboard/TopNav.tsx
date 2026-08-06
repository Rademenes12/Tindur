'use client'
import { useState } from 'react'

export default function TopNav() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  return (
    <header className="bg-sidebar border-b border-border p-4 flex justify-between">
      <h2 className="text-lg font-semibold">Organization Dashboard</h2>
      <button onClick={() => setIsDarkMode(!isDarkMode)} className="px-4 py-2 rounded bg-muted">
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
