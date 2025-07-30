"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Artist, Vote, Donation, User, Battle } from "@/types"
import { DataService } from "@/lib/data-service"

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
