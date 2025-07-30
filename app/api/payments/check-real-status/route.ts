import { type NextRequest, NextResponse } from "next/server"
import PayHero from "payhero-wrapper"
import { PayHeroConfig } from "@/lib/payhero-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ 
        error: "Missing reference parameter" 
      }, { status: 400 })
    }

    console.log("🔍 Checking REAL payment status for reference:", reference)

    // Create PayHero instance
    const payhero = new PayHero(PayHeroConfig)
    
    // Check actual transaction status with PayHero
    let paymentStatus
    try {
      // Try to get transaction by external reference
      paymentStatus = await payhero.getTransactionByReference(reference)
      console.log("📥 PayHero response:", JSON.stringify(paymentStatus, null, 2))
    } catch (error) {
      console.error("❌ PayHero API error:", error)
      // If PayHero API fails, return pending status
      return NextResponse.json({
        status: "pending",
        message: "Payment is being processed",
        reference,
        timestamp: new Date().toISOString()
      })
    }

    // Map PayHero status to our status
    let status = "pending"
    let message = "Payment is being processed"

    if (paymentStatus?.success) {
      const payheroStatus = paymentStatus.data?.status?.toLowerCase()
      
      switch (payheroStatus) {
        case "completed":
        case "success":
          status = "completed"
          message = "Payment completed successfully"
          break
        case "failed":
        case "declined":
        case "rejected":
          status = "failed"
          message = paymentStatus.data?.message || "Payment failed"
          break
        case "cancelled":
          status = "cancelled"
          message = "Payment was cancelled"
          break
        case "pending":
        case "processing":
          status = "pending"
          message = "Payment is being processed"
          break
        default:
          status = "pending"
          message = "Payment status unknown"
      }
    } else {
      // If PayHero returns error, check if it's a cancelled/failed transaction
      const errorMessage = paymentStatus?.message?.toLowerCase() || ""
      if (errorMessage.includes("cancelled") || errorMessage.includes("failed")) {
        status = "cancelled"
        message = "Payment was cancelled"
      } else {
        status = "pending"
        message = "Payment is being processed"
      }
    }

    console.log("✅ Real payment status determined:", { status, message, reference })

    return NextResponse.json({
      status,
      message,
      reference,
      timestamp: new Date().toISOString(),
      payheroData: paymentStatus?.data
    })

  } catch (error: unknown) {
    console.error("❌ Real payment status check error:", error)
    return NextResponse.json({ 
      error: "Failed to check payment status",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 