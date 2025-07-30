import { type NextRequest, NextResponse } from "next/server"
import PayHero from "payhero-wrapper"
import { PayHeroConfig } from "@/lib/payhero-config"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 STK Push API called")
    
    const paymentDetails = await request.json()
    console.log("📥 Received payment details:", JSON.stringify(paymentDetails, null, 2))
    console.log("🔧 PayHero Config:", JSON.stringify(PayHeroConfig, null, 2))

    const payhero = new PayHero(PayHeroConfig)
    console.log("⚙️ PayHero instance created")
    
    console.log("📤 Making STK Push request...")
    const response = await payhero.makeStkPush(paymentDetails)
    console.log("✅ STK Push response:", JSON.stringify(response, null, 2))

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ STK Push API error:", error)
    console.error("🔍 Error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    })
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 })
  }
}
