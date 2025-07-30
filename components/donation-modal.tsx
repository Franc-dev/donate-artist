/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import type { Artist, Donation } from "@/types"
import { X, CreditCard, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/stores/app-store"
import PayHeroService from "@/lib/payhero-service"
import { PayHeroConfig } from "@/lib/payhero-config"
import PaymentStatusModal from "@/components/payment-status-modal"

interface DonationModalProps {
  artist: Artist | null
  isOpen: boolean
  onClose: () => void
}

const payHero = new PayHeroService(PayHeroConfig)

export default function DonationModal({ artist, isOpen, onClose }: DonationModalProps) {
  const { addDonation, currentUser, setCurrentUser, updateArtistDonations } = useAppStore()
  const [amount, setAmount] = useState("")
  const [donorName, setDonorName] = useState(currentUser?.name || "")
  const [donorEmail, setDonorEmail] = useState(currentUser?.email || "")
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || "")
  const [message, setMessage] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "pesapal">("mpesa")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPaymentStatus, setShowPaymentStatus] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState<any>(null)
  const [currentDonation, setCurrentDonation] = useState<Donation | null>(null)

  const presetAmounts = [100, 500, 1000, 2500, 5000]

  if (!isOpen || !artist) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!amount || Number.parseFloat(amount) < 10) {
      newErrors.amount = "Minimum donation is KES 10"
    }
    if (!donorName.trim()) {
      newErrors.donorName = "Name is required"
    }
    if (!donorEmail.trim() || !/\S+@\S+\.\S+/.test(donorEmail)) {
      newErrors.donorEmail = "Valid email is required"
    }
    if (paymentMethod === "mpesa" && (!donorPhone.trim() || !/^254\d{9}$/.test(donorPhone.replace(/\D/g, "")))) {
      newErrors.donorPhone = "Valid phone number is required (254XXXXXXXXX)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent form submission and page refresh
    
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const donation: Donation = {
        id: Date.now().toString(),
        artistId: artist.id,
        artistName: artist.name,
        amount: Number.parseFloat(amount),
        donorName,
        donorEmail,
        message,
        status: "pending",
        paymentMethod,
        createdAt: new Date().toISOString(),
      }
      setCurrentDonation(donation)

      // Update or create user
      if (!currentUser) {
        const newUser = {
          id: Date.now().toString(),
          name: donorName,
          email: donorEmail,
          phone: donorPhone,
          totalDonated: Number.parseFloat(amount),
          donationCount: 1,
          votesCount: 0,
        }
        setCurrentUser(newUser)
      } else {
        setCurrentUser({
          ...currentUser,
          totalDonated: currentUser.totalDonated + Number.parseFloat(amount),
          donationCount: currentUser.donationCount + 1,
        })
      }

      if (paymentMethod === "mpesa") {
        const paymentDetails = {
          amount: Number.parseFloat(amount),
          phone_number: donorPhone.replace(/\D/g, ""),
          channel_id: 3054,
          provider: "m-pesa" as const,
          external_reference: donation.id,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/callback`,
        }

        console.log("🔍 Payment Details:", JSON.stringify(paymentDetails, null, 2))

        console.log("📤 Making STK Push request to PayHero...")
        const response = await payHero.makeStkPush(paymentDetails)
        console.log("📥 PayHero response:", JSON.stringify(response, null, 2))

        if (response.success) {
          // Show payment status modal with transaction details
          setPaymentResponse(response)
          setShowPaymentStatus(true)
        } else {
          console.error("❌ Payment failed:", response.message)
          throw new Error(response.message || "Payment initiation failed")
        }
      } else {
        const pesapalDetails = {
          currency: "KES",
          amount: Number.parseFloat(amount),
          description: `Donation to ${artist.name}`,
          customerEmail: donorEmail,
          customerFirstName: donorName.split(" ")[0],
          customerLastName: donorName.split(" ").slice(1).join(" ") || "User",
          phoneNumber: donorPhone,
          countryCode: "KE",
        }

        const response = await payHero.initiatePesapalPayment(pesapalDetails)

        if (response.orderTrackingId && response.redirectUrl) {
          donation.orderTrackingId = response.orderTrackingId
          addDonation(donation)

          // Redirect to Pesapal
          window.open(response.redirectUrl, "_blank")
          onClose()
        } else {
          throw new Error("Failed to initiate Pesapal payment")
        }
      }
    } catch (error) {
      console.error("Donation error:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200">
        <div className="sticky top-0 bg-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-xl font-bold">Support {artist.name}</h2>
              <p className="text-indigo-100 text-sm">{artist.genre}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleDonate} className="p-6 space-y-6">
          {/* Amount Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Donation Amount (KES)</label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`p-2 text-sm border transition-colors ${
                    amount === preset.toString()
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter custom amount"
              className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("mpesa")}
                className={`p-3 border transition-colors flex items-center justify-center space-x-2 ${
                  paymentMethod === "mpesa"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">M-Pesa</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("pesapal")}
                className={`p-3 border transition-colors flex items-center justify-center space-x-2 ${
                  paymentMethod === "pesapal"
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm font-medium">Card/Bank</span>
              </button>
            </div>
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Full Name *</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="Enter your full name"
                required
              />
              {errors.donorName && <p className="text-red-500 text-xs mt-1">{errors.donorName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email Address *</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="Enter your email"
                required
              />
              {errors.donorEmail && <p className="text-red-500 text-xs mt-1">{errors.donorEmail}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Phone Number {paymentMethod === "mpesa" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="254XXXXXXXXX"
              />
              {errors.donorPhone && <p className="text-red-500 text-xs mt-1">{errors.donorPhone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full p-3 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-1"
                placeholder="Leave a message for the artist..."
              />
            </div>
          </div>

          {/* Donate Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3"
          >
            {isProcessing ? "Processing..." : `Donate KES ${amount || "0"}`}
          </Button>
        </form>
      </div>

      {/* Payment Status Modal */}
      <PaymentStatusModal
        isOpen={showPaymentStatus}
        onClose={(paymentSucceeded: boolean = false) => {
          setShowPaymentStatus(false)
          // Only record donation if payment actually succeeded
          if (paymentSucceeded && artist && currentDonation) {
            currentDonation.status = "completed"
            addDonation(currentDonation)
            updateArtistDonations(artist.id, Number.parseFloat(amount))
            onClose()
          } else if (!paymentSucceeded) {
            // Payment failed or was cancelled, don't record donation
            console.log("Payment not completed, donation not recorded")
          }
        }}
        paymentMethod={paymentMethod}
        amount={Number.parseFloat(amount)}
        artistName={artist?.name || ""}
        phoneNumber={donorPhone}
        transactionId={paymentResponse?.data?.transaction_id}
        externalReference={currentDonation?.id}
      />
    </div>
  )
}
