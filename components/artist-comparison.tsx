"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown, Heart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"
import type { Artist } from "@/types"

interface ArtistComparisonProps {
  artist1: Artist
  artist2: Artist
  onDonate: (artist: Artist) => void
}

export default function ArtistComparison({ artist1, artist2, onDonate }: ArtistComparisonProps) {
  const { currentUser, setCurrentUser, addVote, getUserVoteForArtist, updateArtistVotes } = useAppStore()
  const [votingArtist, setVotingArtist] = useState<string | null>(null)

  const handleVote = async (artistId: string, voteType: "upvote" | "downvote") => {
    if (!currentUser) {
      // Show intro modal instead of creating anonymous user
      return
    }

    const userId = currentUser.id
    
    // Check if user has already voted for any artist
    const existingVoteForArtist1 = getUserVoteForArtist(artist1.id, userId)
    const existingVoteForArtist2 = getUserVoteForArtist(artist2.id, userId)
    const hasVotedForAnyArtist = existingVoteForArtist1 || existingVoteForArtist2

    // If user has voted for a different artist, remove that vote first
    if (hasVotedForAnyArtist && hasVotedForAnyArtist.artistId !== artistId) {
      // Remove vote from the other artist
      updateArtistVotes(hasVotedForAnyArtist.artistId, hasVotedForAnyArtist.type === "upvote" ? -1 : 1)
    }

    const existingVote = getUserVoteForArtist(artistId, userId)

    if (existingVote) {
      // User already voted for this artist - allow changing vote
      if (existingVote.type === voteType) {
        // Same vote type - do nothing
        return
      } else {
        // Different vote type - update the vote
        // Remove old vote effect
        updateArtistVotes(artistId, existingVote.type === "upvote" ? -1 : 1)
        // Add new vote effect
        updateArtistVotes(artistId, voteType === "upvote" ? 1 : -1)
        
        // Update the vote in the store
        const updatedVote = { ...existingVote, type: voteType, timestamp: new Date().toISOString() }
        // Note: In a real app, you'd update the vote in the store
        return
      }
    }

    setVotingArtist(artistId)

    try {
      const vote = {
        id: Date.now().toString(),
        artistId,
        userId,
        type: voteType,
        timestamp: new Date().toISOString(),
      }

      addVote(vote)
      updateArtistVotes(artistId, voteType === "upvote" ? 1 : -1)

      setCurrentUser({
        ...currentUser,
        votesCount: currentUser.votesCount + 1,
      })
    } catch (error) {
      console.error("Voting error:", error)
    } finally {
      setVotingArtist(null)
    }
  }

  const getVoteStatus = (artistId: string) => {
    if (!currentUser) return null
    return getUserVoteForArtist(artistId, currentUser.id)
  }

  const ArtistCard = ({ artist, position }: { artist: Artist; position: "left" | "right" }) => {
    const userVote = getVoteStatus(artist.id)
    const isVoting = votingArtist === artist.id
    
    // Check if user has voted for the other artist
    const otherArtistId = artist.id === artist1.id ? artist2.id : artist1.id
    const hasVotedForOtherArtist = getVoteStatus(otherArtistId)

    return (
      <div className="bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Artist Header */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-32 h-32">
            <img
              src={artist.avatar || "/placeholder.svg"}
              alt={artist.name}
              className="w-full h-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-slate-900">{artist.name}</h2>
            <p className="text-indigo-600 font-medium">{artist.genre}</p>
          </div>
        </div>

        {/* YouTube Video */}
        <div className="aspect-video bg-slate-100 overflow-hidden">
          <iframe
            src={artist.youtubeUrl}
            title={`${artist.name} - Latest Track`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Artist Bio */}
        <p className="text-sm text-slate-600 leading-relaxed text-center">{artist.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-slate-900">{artist.votes.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Votes</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-slate-900">KES {artist.totalDonations.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Donated</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-slate-900">{artist.donorCount}</div>
            <div className="text-xs text-slate-500">Supporters</div>
          </div>
        </div>

        {/* Voting Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => handleVote(artist.id, "upvote")}
            disabled={isVoting || (hasVotedForOtherArtist && !userVote)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
              userVote?.type === "upvote"
                ? "bg-emerald-600 text-white"
                : hasVotedForOtherArtist && !userVote
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <ChevronUp className="w-5 h-5" />
            <span>Upvote</span>
          </button>
          <button
            onClick={() => handleVote(artist.id, "downvote")}
            disabled={isVoting || (hasVotedForOtherArtist && !userVote)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
              userVote?.type === "downvote"
                ? "bg-red-600 text-white"
                : hasVotedForOtherArtist && !userVote
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <ChevronDown className="w-5 h-5" />
            <span>Downvote</span>
          </button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4">
          {artist.socialLinks.instagram && (
            <a
              href={`https://instagram.com/${artist.socialLinks.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {artist.socialLinks.youtube && (
            <a
              href={`https://youtube.com/${artist.socialLinks.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {artist.socialLinks.spotify && (
            <a
              href={`https://open.spotify.com/artist/${artist.socialLinks.spotify}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-green-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Donate Button */}
        <Button onClick={() => onDonate(artist)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          <Heart className="w-4 h-4 mr-2" />
          Support {artist.name}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Battle Header */}
      <div className="text-center space-y-4">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900">Artist Battle</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Vote for your favorite artist and support them with donations. Battle ends in 24 hours!
        </p>
      </div>

      {/* VS Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-white font-bold text-xl">
          VS
        </div>
      </div>

      {/* Artist Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <ArtistCard artist={artist1} position="left" />
        <ArtistCard artist={artist2} position="right" />
      </div>

      {/* Battle Stats */}
      <div className="bg-white border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto">
        <h3 className="font-playfair text-xl font-bold text-center mb-4">Battle Statistics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total Votes</span>
            <span className="font-bold">{(artist1.votes + artist2.votes).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total Donations</span>
            <span className="font-bold">KES {(artist1.totalDonations + artist2.totalDonations).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Total Supporters</span>
            <span className="font-bold">{artist1.donorCount + artist2.donorCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
