import type { PaymentDetails, PesapalPaymentDetails } from "@/types"

class PayHeroService {
  private config: any

  constructor(config: any) {
    this.config = config
  }

  async makeStkPush(paymentDetails: PaymentDetails) {
    try {
      const response = await fetch("/api/payments/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      })

      if (!response.ok) {
        throw new Error("STK Push failed")
      }

      return await response.json()
    } catch (error) {
      console.error("STK Push error:", error)
      throw error
    }
  }

  async initiatePesapalPayment(paymentDetails: PesapalPaymentDetails) {
    try {
      const response = await fetch("/api/payments/pesapal-initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      })

      if (!response.ok) {
        throw new Error("Pesapal payment initiation failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Pesapal payment error:", error)
      throw error
    }
  }

  async verifyPesapalTransaction(orderTrackingId: string) {
    try {
      const response = await fetch(`/api/payments/pesapal-verify?orderTrackingId=${orderTrackingId}`)

      if (!response.ok) {
        throw new Error("Transaction verification failed")
      }

      return await response.json()
    } catch (error) {
      console.error("Transaction verification error:", error)
      throw error
    }
  }
}

export default PayHeroService
