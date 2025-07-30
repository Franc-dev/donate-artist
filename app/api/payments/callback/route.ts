/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Payment callback received")
    const callbackData = await request.json()
    console.log("📥 Callback data:", JSON.stringify(callbackData, null, 2))

    // Extract payment details from PayHero callback
    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      Amount,
      MpesaReceiptNumber,
      TransactionDate,
      PhoneNumber,
      ExternalReference
    } = callbackData

    console.log("🔍 Processing callback:", {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      Amount,
      MpesaReceiptNumber,
      ExternalReference
    })

    // Determine payment status based on ResultCode
    let paymentStatus = "pending"
    let message = "Payment is being processed"

    switch (ResultCode) {
      case "0":
        paymentStatus = "completed"
        message = "Payment completed successfully"
        break
      case "1":
        paymentStatus = "failed"
        message = "Insufficient funds"
        break
      case "2":
        paymentStatus = "failed"
        message = "Less than minimum transaction value"
        break
      case "3":
        paymentStatus = "failed"
        message = "More than maximum transaction value"
        break
      case "4":
        paymentStatus = "failed"
        message = "Would exceed daily transfer limit"
        break
      case "5":
        paymentStatus = "failed"
        message = "Would exceed minimum balance"
        break
      case "6":
        paymentStatus = "failed"
        message = "Unresolved primary party"
        break
      case "7":
        paymentStatus = "failed"
        message = "Unresolved counter party"
        break
      case "8":
        paymentStatus = "failed"
        message = "Would exceed maximum balance"
        break
      case "11":
        paymentStatus = "cancelled"
        message = "Debit account invalid"
        break
      case "12":
        paymentStatus = "cancelled"
        message = "Credit account invalid"
        break
      case "13":
        paymentStatus = "cancelled"
        message = "Unresolved debit account"
        break
      case "14":
        paymentStatus = "cancelled"
        message = "Unresolved credit account"
        break
      case "15":
        paymentStatus = "cancelled"
        message = "Duplicate detected"
        break
      case "17":
        paymentStatus = "cancelled"
        message = "Internal failure"
        break
      case "20":
        paymentStatus = "cancelled"
        message = "Unresolved Initiator"
        break
      case "26":
        paymentStatus = "cancelled"
        message = "Traffic blocking condition in place"
        break
      default:
        paymentStatus = "failed"
        message = ResultDesc || "Payment failed"
    }

    console.log("✅ Payment status determined:", { paymentStatus, message })

    // In a real app, you would:
    // 1. Update the donation status in your database
    // 2. Send real-time updates to the frontend (WebSocket/Server-Sent Events)
    // 3. Update artist donation totals
    // 4. Send confirmation emails

    // For now, we'll log the status for demo purposes
    if (paymentStatus === "completed") {
      console.log("🎉 Payment successful for donation:", ExternalReference)
      console.log("💰 Amount:", Amount)
      console.log("📱 Phone:", PhoneNumber)
      console.log("🧾 Receipt:", MpesaReceiptNumber)
    } else {
      console.log("❌ Payment failed for donation:", ExternalReference)
      console.log("🚫 Reason:", message)
    }

    return NextResponse.json({ 
      success: true, 
      message: "Callback processed successfully",
      paymentStatus,
      externalReference: ExternalReference
    })

  } catch (error: unknown) {
    console.error("❌ Payment callback error:", error)
    console.error("🔍 Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      success: false, 
      error: "Callback processing failed" 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Payment callback GET received")
    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams.entries())
    console.log("📥 Callback params:", JSON.stringify(params, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: "Callback processed successfully" 
    })
  } catch (error) {
    console.error("❌ Payment callback GET error:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Callback processing failed" 
    }, { status: 500 })
  }
} 