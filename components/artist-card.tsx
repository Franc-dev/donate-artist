"use client"

import type { Artist } from "@/types"
import { Heart, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"

interface ArtistCardProps {
  artist: Artist
  onDonate: (artist: Artist) => void
}

export default function ArtistCard({ artist, onDonate }: ArtistCardProps) {
  const { currentUser, toggleFavorite } = useAppStore()
  const isFavorite = currentUser?.favoriteArtists.includes(artist.id) || false

  const categoryColors = {
    musician: "from-purple-500 to-pink-500",
    painter: "from-orange-500 to-red-500",
    writer: "from-green-500 to-teal-500",
    photographer: "from-blue-500 to-indigo-500",
    dancer: "from-pink-500 to-rose-500",
    other: "from-gray-500 to-slate-500",
  }

  return (
    <div className="card-artistic p-6 space-y-4">
      {/* Artist Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={artist.avatar || "/placeholder.svg"}
              alt={artist.name}
              className="w-16 h-16 object-cover border-2 border-white shadow-md"
            />
            {artist.featured && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">★</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-playfair font-bold text-lg text-gray-900">{artist.name}</h3>
            <div
              className={`inline-block px-3 py-1 text-xs font-medium text-white bg-gradient-to-r ${categoryColors[artist.category]}`}
            >
              {artist.category.charAt(0).toUpperCase() + artist.category.slice(1)}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite(artist.id)}
          className="text-gray-400 hover:text-pink-500"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-pink-500 text-pink-500" : ""}`} />
        </Button>
      </div>

      {/* Artist Bio */}
      <p className="text-sm text-gray-600 leading-relaxed">{artist.bio}</p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4" />
          <span className="font-medium">KES {artist.totalDonations.toLocaleString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>{artist.donorCount} supporters</span>
        </div>
      </div>

      {/* Social Links */}
      {Object.keys(artist.socialLinks).length > 0 && (
        <div className="flex items-center space-x-3 text-xs">
          {artist.socialLinks.instagram && (
            <a
              href={`https://instagram.com/${artist.socialLinks.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600"
            >
              @{artist.socialLinks.instagram}
            </a>
          )}
          {artist.socialLinks.twitter && (
            <a
              href={`https://twitter.com/${artist.socialLinks.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              @{artist.socialLinks.twitter}
            </a>
          )}
          {artist.socialLinks.website && (
            <a
              href={`https://${artist.socialLinks.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-600"
            >
              {artist.socialLinks.website}
            </a>
          )}
        </div>
      )}

      {/* Donate Button */}
      <Button onClick={() => onDonate(artist)} className="w-full btn-artistic text-sm font-medium">
        Support {artist.name}
      </Button>
    </div>
  )
}
