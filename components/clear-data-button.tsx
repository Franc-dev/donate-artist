"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"

export default function ClearDataButton() {
  const { clearAllData } = useAppStore()
  const [isClearing, setIsClearing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClearData = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsClearing(true)
    try {
      await clearAllData()
      setShowConfirm(false)
    } catch (error) {
      console.error("Failed to clear data:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full shadow-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-semibold text-slate-900">Clear All Data?</h3>
          </div>
          
          <p className="text-slate-600 text-sm">
            This will permanently delete all votes, donations, and user data from both Redis and local storage. 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleClearData}
              disabled={isClearing}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isClearing ? "Clearing..." : "Yes, Clear All Data"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button
      onClick={handleClearData}
      variant="outline"
      size="sm"
      className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
    >
      <Trash2 className="w-4 h-4 mr-2" />
      Clear All Data
    </Button>
  )
} 