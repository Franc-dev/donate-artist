"use client"

import { useState } from "react"
import { X, Trophy, Heart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"

interface IntroModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function IntroModal({ isOpen, onClose }: IntroModalProps) {
  const { setCurrentUser, setShowIntroModal } = useAppStore()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Valid email is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStart = () => {
    if (!validateForm()) return

    const user = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      totalDonated: 0,
      donationCount: 0,
      votesCount: 0,
    }

    setCurrentUser(user)
    setShowIntroModal(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full shadow-xl border border-slate-200">
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <div>
                <h2 className="font-playfair text-2xl font-bold">Welcome to Artist Battle</h2>
                <p className="text-indigo-100 text-sm">Join the ultimate music showdown!</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Vote for Your Favorites</h3>
                <p className="text-sm text-slate-600">Support artists with upvotes and downvotes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Make Donations</h3>
                <p className="text-sm text-slate-600">Directly support artists financially</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">Track Battles</h3>
                <p className="text-sm text-slate-600">See real-time battle statistics</p>
              </div>
            </div>
          </div>

          {/* User Info Form */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Let's Get Started</h3>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Start Button */}
          <Button onClick={handleStart} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3">
            Start Battling!
          </Button>

          <p className="text-xs text-slate-500 text-center">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
} 