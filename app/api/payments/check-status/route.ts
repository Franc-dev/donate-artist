import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ 
        error: "Missing reference parameter" 
      }, { status: 400 })
    }

    console.log("🔍 Checking payment status for reference:", reference)

    // In production, this would:
    // 1. Query your database for the payment status
    // 2. Check PayHero API for transaction status
    // 3. Return the actual payment status

    // For demo, simulate status check
    const isCompleted = Math.random() > 0.7 // 30% chance of completion
    
    if (isCompleted) {
      return NextResponse.json({
        status: "completed",
        message: "Payment completed successfully",
        reference,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        status: "pending",
        message: "Payment is still being processed",
        reference,
        timestamp: new Date().toISOString()
      })
    }

  } catch (error: unknown) {
    console.error("❌ Status check error:", error)
    return NextResponse.json({ 
      error: "Failed to check payment status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 