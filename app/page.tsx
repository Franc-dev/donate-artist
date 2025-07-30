/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Trophy, Clock, Users } from "lucide-react"
import ArtistComparison from "@/components/artist-comparison"
import DonationModal from "@/components/donation-modal"
import ClearDataButton from "@/components/clear-data-button"
import IntroModal from "@/components/intro-modal"
import { useAppStore } from "@/stores/app-store"
import type { Artist } from "@/types"

export default function HomePage() {
  const { 
    artists, 
    currentBattle, 
    votes, 
    donations, 
    currentUser, 
    showIntroModal, 
    setShowIntroModal,
    loadArtists,
    loadCurrentBattle,
    syncRedisData
  } = useAppStore()
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([loadArtists(), loadCurrentBattle()])
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [loadArtists, loadCurrentBattle])

  // Sync Redis data every 5 seconds for real-time updates
  useEffect(() => {
    const syncInterval = setInterval(() => {
      syncRedisData()
    }, 5000)

    return () => clearInterval(syncInterval)
  }, [syncRedisData])

  const handleDonate = (artist: Artist) => {
    if (!currentUser) {
      setShowIntroModal(true)
      return
    }
    setSelectedArtist(artist)
    setIsModalOpen(true)
  }

  const totalVotes = votes.length
  const totalAmount = donations.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0)

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Loading Artist Battle...</h1>
          <p className="text-slate-600">Setting up the ultimate music showdown for you.</p>
        </div>
      </div>
    )
  }

  // Show no data state
  if (!artists.length || !currentBattle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Active Battle</h1>
          <p className="text-slate-600">There are currently no active artist battles. Check back later!</p>
        </div>
      </div>
    )
  }

  const artist1 = artists.find((a) => a.id === currentBattle?.artist1Id)
  const artist2 = artists.find((a) => a.id === currentBattle?.artist2Id)

  if (!artist1 || !artist2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Battle Setup Error</h1>
          <p className="text-slate-600">Unable to load the current artist battle.</p>
        </div>
      </div>
    )
  }

  // Calculate time remaining
  const timeRemaining = new Date(currentBattle.endDate).getTime() - new Date().getTime()
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))
  const minutesRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-playfair text-xl font-bold text-slate-900">Artist Battle</h1>
            </div>

            {currentUser && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-slate-600">
                  Welcome, <span className="font-medium text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-slate-600">
                    Votes: <span className="font-medium text-slate-900">{currentUser.votesCount}</span>
                  </div>
                  <div className="text-slate-600">
                    Donated:{" "}
                    <span className="font-medium text-slate-900">KES {currentUser.totalDonated.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Battle Timer */}
      <section className="bg-indigo-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Battle ends in: {hoursRemaining}h {minutesRemaining}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{totalVotes} total votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>KES {totalAmount.toLocaleString()} donated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArtistComparison artist1={artist1} artist2={artist2} onDonate={handleDonate} />
        </div>
      </main>

      {/* Recent Activity */}
      {(votes.length > 0 || donations.length > 0) && (
        <section className="py-12 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-8 text-center">Recent Activity</h3>
            <div className="space-y-4">
              {[...votes.slice(-3), ...donations.slice(-3)]
                .sort((a, b) => {
                  const aTime = "timestamp" in a ? new Date(a.timestamp).getTime() : new Date(a.createdAt).getTime()
                  const bTime = "timestamp" in b ? new Date(b.timestamp).getTime() : new Date(b.createdAt).getTime()
                  return bTime - aTime
                })
                .slice(0, 5)
                .map((activity, index) => {
                  const isVote = "type" in activity
                  const artist = artists.find((a) => a.id === activity.artistId)

                  return (
                    <div key={index} className="bg-white p-4 border border-slate-200 shadow-sm">
                      <p className="text-sm text-slate-700">
                        {isVote ? (
                          <>
                            Someone {activity.type === "upvote" ? "upvoted" : "downvoted"}{" "}
                            <span className="font-medium">{artist?.name}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-medium">{activity.donorName}</span> donated KES {activity.amount} to{" "}
                            <span className="font-medium">{artist?.name}</span>
                          </>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(isVote ? activity.timestamp : activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )
                })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-6 h-6" />
            <span className="font-playfair text-lg font-bold">Artist Battle</span>
          </div>
          <p className="text-slate-400 text-sm">Vote for your favorite artists and support them with donations.</p>
          <p className="text-slate-500 text-xs mt-2">Powered by PayHero</p>
        </div>
      </footer>

      {/* Donation Modal */}
      <DonationModal
        artist={selectedArtist}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArtist(null)
        }}
      />

      {/* Intro Modal */}
      <IntroModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
      />
    </div>
  )
}
