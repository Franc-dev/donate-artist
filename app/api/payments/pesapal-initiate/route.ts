import { type NextRequest, NextResponse } from "next/server"
import PayHero from "payhero-wrapper"
import { PayHeroConfig } from "@/lib/payhero-config"

export async function POST(request: NextRequest) {
  try {
    const paymentDetails = await request.json()

    const payhero = new PayHero(PayHeroConfig)
    const response = await payhero.initiatePesapalPayment(paymentDetails)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Pesapal initiation API error:", error)
    return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 })
  }
}
