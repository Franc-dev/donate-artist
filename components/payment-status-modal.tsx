/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect, useRef } from "react"
import { CheckCircle, XCircle, Loader2, Smartphone, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentStatusModalProps {
  isOpen: boolean
  onClose: (paymentSucceeded?: boolean) => void
  paymentMethod: "mpesa" | "pesapal"
  amount: number
  artistName: string
  phoneNumber?: string
  transactionId?: string
  externalReference?: string
}

type PaymentStatus = "processing" | "success" | "failed" | "cancelled" | "timeout"

export default function PaymentStatusModal({ 
  isOpen, 
  onClose, 
  paymentMethod, 
  amount, 
  artistName,
  phoneNumber,
  transactionId,
  externalReference
}: PaymentStatusModalProps) {
  const [status, setStatus] = useState<PaymentStatus>("processing")
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(60) // 60 seconds timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("processing")
      setMessage("")
      setCountdown(60)
      startRealTimePaymentTracking()
    } else {
      cleanup()
    }

    return () => {
      cleanup()
    }
  }, [isOpen])

  // Countdown timer
  useEffect(() => {
    if (!isOpen || status !== "processing") return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setStatus("timeout")
          setMessage("Payment timed out. Please try again.")
          cleanup()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, status])

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const startRealTimePaymentTracking = () => {
    if (!externalReference) {
      console.log("❌ No external reference provided")
      setStatus("failed")
      setMessage("Payment reference missing")
      return
    }

    console.log("🔄 Starting real payment tracking for:", externalReference)
    
    // REAL PAYMENT TRACKING - Check actual PayHero status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/check-real-status?reference=${externalReference}`)
        const data = await response.json()
        
        console.log("🔍 Real payment status check:", data)
        
        if (data.status === "completed") {
          setStatus("success")
          setMessage("Payment completed successfully!")
          cleanup()
        } else if (data.status === "failed" || data.status === "cancelled") {
          setStatus(data.status)
          setMessage(data.message || "Payment failed")
          cleanup()
        } else if (data.status === "pending") {
          // Continue checking if still pending
          setTimeout(checkPaymentStatus, 2000)
        }
      } catch (error) {
        console.error("❌ Payment status check failed:", error)
        // Continue checking on error
        setTimeout(checkPaymentStatus, 3000)
      }
    }

    // Start checking immediately
    checkPaymentStatus()
  }



  const handleCancel = () => {
    setStatus("cancelled")
    setMessage("Payment cancelled by user.")
    cleanup()
  }

  const handleRetry = () => {
    setStatus("processing")
    setMessage("")
    setCountdown(60)
    startRealTimePaymentTracking()
  }

  if (!isOpen) return null

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
      case "success":
        return <CheckCircle className="w-16 h-16 text-emerald-600" />
      case "failed":
      case "cancelled":
      case "timeout":
        return <XCircle className="w-16 h-16 text-red-600" />
      default:
        return <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-indigo-600"
      case "success":
        return "text-emerald-600"
      case "failed":
      case "cancelled":
      case "timeout":
        return "text-red-600"
      default:
        return "text-indigo-600"
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "processing":
        return "Processing Payment"
      case "success":
        return "Payment Successful"
      case "failed":
        return "Payment Failed"
      case "cancelled":
        return "Payment Cancelled"
      case "timeout":
        return "Payment Timed Out"
      default:
        return "Processing Payment"
    }
  }

  const getInstructions = () => {
    if (status !== "processing") return null

    if (paymentMethod === "mpesa") {
      return (
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
            <Smartphone className="w-4 h-4" />
            <span>Check your phone for M-Pesa prompt</span>
          </div>
          <div className="text-xs text-slate-500">
            Enter your M-Pesa PIN when prompted
          </div>
          <div className="text-xs text-slate-500">
            Time remaining: {countdown}s
          </div>
          {externalReference && (
            <div className="text-xs text-slate-400">
              Reference: {externalReference.slice(-8)}
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
            <CreditCard className="w-4 h-4" />
            <span>Redirecting to payment gateway...</span>
          </div>
          <div className="text-xs text-slate-500">
            Complete payment on the next page
          </div>
        </div>
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full shadow-xl border border-slate-200">
        <div className="p-8 space-y-6 text-center">
          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <div>
            <h2 className={`text-2xl font-bold ${getStatusColor()}`}>
              {getStatusTitle()}
            </h2>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <div className="text-lg font-semibold text-slate-900">
              KES {amount.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600">
              Supporting {artistName}
            </div>
            {phoneNumber && (
              <div className="text-xs text-slate-500">
                {phoneNumber}
              </div>
            )}
          </div>

          {/* Instructions */}
          {getInstructions()}

          {/* Status Message */}
          {message && (
            <div className={`text-sm ${status === "success" ? "text-emerald-600" : "text-red-600"}`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {status === "processing" && (
              <div className="space-y-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancel Payment
                </Button>
              </div>
            )}

            {status === "success" && (
              <Button
                onClick={() => onClose(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Continue
              </Button>
            )}

            {(status === "failed" || status === "cancelled" || status === "timeout") && (
              <div className="space-y-2">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => onClose(false)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 