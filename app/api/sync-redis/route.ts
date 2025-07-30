import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"
import { DataService } from "@/lib/data-service"

export async function GET(request: NextRequest) {
  try {
    // Get all votes from Redis
    const votesData = await redis.lrange("votes", 0, -1)
    const votes = votesData.map(voteStr => JSON.parse(voteStr))

    // Get all donations from Redis
    const donationsData = await redis.lrange("donations", 0, -1)
    const donations = donationsData.map(donationStr => JSON.parse(donationStr))

    // Get artist votes and donations from Redis
    const artists = await DataService.loadArtists()
    const artistsWithRedisData = await Promise.all(
      artists.map(async (artist) => {
        const redisVotes = await redis.get(`artist:${artist.id}:votes`) || 0
        const redisDonations = await redis.get(`artist:${artist.id}:donations`) || 0
        
        return {
          ...artist,
          votes: Number(redisVotes),
          totalDonations: Number(redisDonations),
        }
      })
    )

    return NextResponse.json({
      votes,
      donations,
      artists: artistsWithRedisData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Redis sync error:", error)
    return NextResponse.json({ 
      error: "Failed to sync Redis data",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 