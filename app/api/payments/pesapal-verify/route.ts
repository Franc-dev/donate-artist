import { type NextRequest, NextResponse } from "next/server"
import PayHero from "payhero-wrapper"
import { PayHeroConfig } from "@/lib/payhero-config"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderTrackingId = searchParams.get("orderTrackingId")

    if (!orderTrackingId) {
      return NextResponse.json({ error: "Order tracking ID is required" }, { status: 400 })
    }

    const payhero = new PayHero(PayHeroConfig)
    const response = await payhero.verifyPesapalTransaction(orderTrackingId)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Pesapal verification API error:", error)
    return NextResponse.json({ error: "Transaction verification failed" }, { status: 500 })
  }
}
