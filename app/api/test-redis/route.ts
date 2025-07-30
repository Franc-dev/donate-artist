import { type NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

export async function GET(request: NextRequest) {
  try {
    // Test Redis connection
    await redis.set("test", "Hello Redis!")
    const testValue = await redis.get("test")
    await redis.del("test")

    return NextResponse.json({
      success: true,
      message: "Redis is working!",
      testValue,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Redis test error:", error)
    return NextResponse.json({ 
      success: false,
      error: "Redis connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 