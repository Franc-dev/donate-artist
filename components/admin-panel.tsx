"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"
import { DataService } from "@/lib/data-service"

export default function AdminPanel() {
  const { setArtists, setCurrentBattle } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const loadSampleData = async () => {
    setIsLoading(true)
    try {
      const { artists, currentBattle } = DataService.createSampleData()
      setArtists(artists)
      setCurrentBattle(currentBattle)
    } catch (error) {
      console.error("Failed to load sample data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={loadSampleData}
        disabled={isLoading}
        className="bg-slate-800 hover:bg-slate-900 text-white text-sm px-4 py-2"
      >
        {isLoading ? "Loading..." : "Load Sample Data"}
      </Button>
    </div>
  )
} 