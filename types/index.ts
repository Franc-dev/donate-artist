export interface Artist {
  id: string
  name: string
  bio: string
  avatar: string
  genre: string
  youtubeUrl: string
  votes: number
  totalDonations: number
  donorCount: number
  socialLinks: {
    instagram?: string
    twitter?: string
    spotify?: string
    youtube?: string
  }
}

export interface Vote {
  id: string
  artistId: string
  userId: string
  type: "upvote" | "downvote"
  timestamp: string
}

export interface Donation {
  id: string
  artistId: string
  artistName: string
  amount: number
  donorName: string
  donorEmail: string
  message?: string
  status: "pending" | "completed" | "failed"
  paymentMethod: "mpesa" | "pesapal"
  transactionId?: string
  orderTrackingId?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  totalDonated: number
  donationCount: number
  votesCount: number
}

export interface Battle {
  id: string
  artist1Id: string
  artist2Id: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface PaymentDetails {
  amount: number
  phone_number?: string
  channel_id?: number
  provider?: "m-pesa"
  external_reference: string
  callback_url: string
}

export interface PesapalPaymentDetails {
  currency: string
  amount: number
  description: string
  customerEmail: string
  customerFirstName: string
  customerLastName: string
  phoneNumber?: string
  countryCode: string
}
