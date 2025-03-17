export interface User {
  id: number
  username: string
  password: string // In a real app, this would be hashed
  email?: string
  name?: string
}

// Roastery data
export interface Roastery {
  id: number
  name: string
  logo: string
  location: string
  founded?: number
  description: string
  website?: string
  coverImage?: string
  coffeeIds: number[]
  featured?: boolean
  // Additional fields
  imageUrl?: string
  kofio_url?: string
  city?: string
  about?: string
  country?: string
  website_url?: string
}

// Coffee price data
export interface CoffeePrice {
  amount: string
  price: number
}

// Purchase history data
export interface PurchaseHistory {
  date: string
  amount: string
  price: number
}

// Coffee data
export interface Coffee {
  id: number
  name: string
  roasteryId: number
  image: string
  beanType: string
  processing: string
  roastLevel: string
  suitableFor: string[]
  flavorProfile: string[]
  prices: CoffeePrice[]
  description?: string
  origin?: string
  altitude?: string
  harvest?: string
  // Additional fields
  variety?: string
  farmer?: string
  cupping_score?: number | null
  decaf?: boolean
}

// Coffee with rating
export interface CoffeeWithRating extends Coffee {
  rating: number
  ratingCount: number
}

// User-specific coffee data
export interface UserCoffee {
  userId: number
  coffeeId: number
  userNotes?: string
  purchaseHistory?: PurchaseHistory[]
  personalRating?: number
  inCollection: boolean
  inWishlist: boolean
}

// Freezer entry
export interface FreezerEntry {
  userId: number
  coffeeId: number
  doses: {
    amount: string
    dateAdded: string
  }[]
}

