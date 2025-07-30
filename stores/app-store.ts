"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Artist, Vote, Donation, User, Battle } from "@/types"
import { DataService } from "@/lib/data-service"
import redis from "@/lib/redis"

interface AppState {
  // Artists
  artists: Artist[]
  setArtists: (artists: Artist[]) => void
  updateArtistVotes: (artistId: string, increment: number) => void
  updateArtistDonations: (artistId: string, amount: number) => void
  loadArtists: () => Promise<void>

  // Current Battle
  currentBattle: Battle | null
  setCurrentBattle: (battle: Battle | null) => void
  loadCurrentBattle: () => Promise<void>

  // Votes
  votes: Vote[]
  addVote: (vote: Vote) => void
  getUserVoteForArtist: (artistId: string, userId: string) => Vote | null
  getUserVotesForArtist: (artistId: string, userId: string) => Vote[]

  // Donations
  donations: Donation[]
  addDonation: (donation: Donation) => void
  updateDonationStatus: (id: string, status: Donation["status"], transactionId?: string) => void

  // Current user
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // UI State
  selectedArtist: Artist | null
  setSelectedArtist: (artist: Artist | null) => void
  showIntroModal: boolean
  setShowIntroModal: (show: boolean) => void

  // Redis functions for real-time data
  updateArtistVotesRedis: (artistId: string, voteChange: number) => Promise<void>
  updateArtistDonationsRedis: (artistId: string, amount: number) => Promise<void>
  addVoteRedis: (vote: Vote) => Promise<void>
  addDonationRedis: (donation: Donation) => Promise<void>
  clearAllData: () => Promise<void>
  syncRedisData: () => Promise<void>
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Artists - empty initial state
      artists: [],
      setArtists: (artists) => set({ artists }),
      updateArtistVotes: (artistId, increment) =>
        set((state) => ({
          artists: state.artists.map((artist) =>
            artist.id === artistId ? { ...artist, votes: artist.votes + increment } : artist,
          ),
        })),
      updateArtistDonations: (artistId, amount) =>
        set((state) => ({
          artists: state.artists.map((artist) =>
            artist.id === artistId
              ? {
                  ...artist,
                  totalDonations: artist.totalDonations + amount,
                  donorCount: artist.donorCount + 1,
                }
              : artist,
          ),
        })),
      loadArtists: async () => {
        try {
          const artists = await DataService.loadArtists()
          set({ artists })
        } catch (error) {
          console.error("Failed to load artists:", error)
        }
      },

      // Current Battle - empty initial state
      currentBattle: null,
      setCurrentBattle: (battle) => set({ currentBattle: battle }),
      loadCurrentBattle: async () => {
        try {
          const battle = await DataService.loadCurrentBattle()
          set({ currentBattle: battle })
        } catch (error) {
          console.error("Failed to load current battle:", error)
        }
      },

      // Votes
      votes: [],
      addVote: (vote) => set((state) => ({ votes: [...state.votes, vote] })),
      getUserVoteForArtist: (artistId, userId) => {
        const state = get()
        return state.votes.find((vote) => vote.artistId === artistId && vote.userId === userId) || null
      },
      getUserVotesForArtist: (artistId, userId) => {
        const state = get()
        return state.votes.filter((vote) => vote.artistId === artistId && vote.userId === userId)
      },

      // Donations
      donations: [],
      addDonation: (donation) => set((state) => ({ donations: [...state.donations, donation] })),
      updateDonationStatus: (id, status, transactionId) =>
        set((state) => ({
          donations: state.donations.map((d) => (d.id === id ? { ...d, status, transactionId } : d)),
        })),

      // Current user
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      // UI State
      selectedArtist: null,
      setSelectedArtist: (artist) => set({ selectedArtist: artist }),
      showIntroModal: true,
      setShowIntroModal: (show) => set({ showIntroModal: show }),

      // Redis functions for real-time data
      updateArtistVotesRedis: async (artistId, voteChange) => {
        try {
          const currentVotes = await redis.get(`artist:${artistId}:votes`) || 0
          const newVotes = Number(currentVotes) + voteChange
          await redis.set(`artist:${artistId}:votes`, newVotes)
          
          // Update local state
          set((state) => ({
            artists: state.artists.map((artist) =>
              artist.id === artistId ? { ...artist, votes: newVotes } : artist
            ),
          }))
        } catch (error) {
          console.error("Redis vote update failed:", error)
        }
      },

      updateArtistDonationsRedis: async (artistId, amount) => {
        try {
          const currentDonations = await redis.get(`artist:${artistId}:donations`) || 0
          const newDonations = Number(currentDonations) + amount
          await redis.set(`artist:${artistId}:donations`, newDonations)
          
          // Update local state
          set((state) => ({
            artists: state.artists.map((artist) =>
              artist.id === artistId ? { ...artist, totalDonations: newDonations } : artist
            ),
          }))
        } catch (error) {
          console.error("Redis donation update failed:", error)
        }
      },

      addVoteRedis: async (vote) => {
        try {
          await redis.lpush("votes", JSON.stringify(vote))
          await redis.expire("votes", 86400) // Expire after 24 hours
          
          // Update local state
          set((state) => ({
            votes: [vote, ...state.votes],
          }))
        } catch (error) {
          console.error("Redis vote add failed:", error)
        }
      },

      addDonationRedis: async (donation) => {
        try {
          await redis.lpush("donations", JSON.stringify(donation))
          await redis.expire("donations", 86400) // Expire after 24 hours
          
          // Update local state
          set((state) => ({
            donations: [donation, ...state.donations],
          }))
        } catch (error) {
          console.error("Redis donation add failed:", error)
        }
      },

      clearAllData: async () => {
        try {
          // Clear Redis data
          await redis.del("votes")
          await redis.del("donations")
          
          // Clear artist votes and donations
          const artists = await DataService.loadArtists()
          for (const artist of artists) {
            await redis.del(`artist:${artist.id}:votes`)
            await redis.del(`artist:${artist.id}:donations`)
          }
          
          // Reset local state
          set({
            votes: [],
            donations: [],
            artists: artists.map(artist => ({
              ...artist,
              votes: 0,
              totalDonations: 0,
              donorCount: 0
            })),
            currentUser: null
          })
          
          console.log("✅ All data cleared successfully")
        } catch (error) {
          console.error("❌ Failed to clear data:", error)
        }
      },

      syncRedisData: async () => {
        try {
          const response = await fetch('/api/sync-redis')
          const data = await response.json()
          
          if (data.artists && data.votes && data.donations) {
            set({
              artists: data.artists,
              votes: data.votes,
              donations: data.donations
            })
            console.log("✅ Redis data synced successfully")
          }
        } catch (error) {
          console.error("❌ Failed to sync Redis data:", error)
        }
      },
    }),
    {
      name: "artist-battle-store",
      partialize: (state) => ({
        artists: state.artists,
        votes: state.votes,
        donations: state.donations,
        currentUser: state.currentUser,
        currentBattle: state.currentBattle,
        showIntroModal: state.showIntroModal,
      }),
    },
  ),
)
