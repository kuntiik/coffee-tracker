import {
  fetchRoastersFromSupabase,
  fetchCoffeesFromSupabase,
  fetchCoffeesByRoasteryId,
} from "./services/supabase-service"

import type { Coffee, Roastery, User, UserCoffee, PurchaseHistory, CoffeeWithRating, FreezerEntry } from "./types"

// Users data
export const users: User[] = [
  {
    id: 1,
    username: "demo",
    password: "password", // In a real app, this would be hashed
    email: "demo@example.com",
    name: "Demo User",
  },
  {
    id: 2,
    username: "alice",
    password: "password",
    email: "alice@example.com",
    name: "Alice Johnson",
  },
]

// Initialize with empty data
export let roasteries: Roastery[] = []
export let coffees: Coffee[] = []

// Mock userCoffees data
const userCoffees: UserCoffee[] = [
  {
    userId: 1,
    coffeeId: 1,
    inCollection: true,
    inWishlist: false,
    personalRating: 4,
    purchaseHistory: [{ date: "2024-01-15", amount: "250g", price: 14.99 }],
  },
  {
    userId: 1,
    coffeeId: 2,
    inCollection: false,
    inWishlist: true,
  },
  {
    userId: 2,
    coffeeId: 3,
    inCollection: true,
    inWishlist: false,
    personalRating: 5,
    purchaseHistory: [{ date: "2024-02-01", amount: "500g", price: 25.99 }],
  },
  {
    userId: 2,
    coffeeId: 4,
    inCollection: false,
    inWishlist: false,
  },
]

// Mock freezerEntries data
const freezerEntries: FreezerEntry[] = [
  {
    userId: 1,
    coffeeId: 1,
    doses: [{ amount: "18g", dateAdded: "2024-03-01" }],
  },
  {
    userId: 2,
    coffeeId: 3,
    doses: [
      { amount: "20g", dateAdded: "2024-02-10" },
      { amount: "20g", dateAdded: "2024-02-15" },
    ],
  },
]

// Load data from Supabase
export async function initializeData() {
  try {
    // Fetch roasters from Supabase
    const fetchedRoasters = await fetchRoastersFromSupabase()

    if (fetchedRoasters.length > 0) {
      roasteries = fetchedRoasters
      console.log("Loaded roasters from Supabase:", roasteries.length)
    } else {
      console.log("No roasters found in Supabase")
      roasteries = []
    }

    // Fetch coffees from Supabase
    const fetchedCoffees = await fetchCoffeesFromSupabase()

    if (fetchedCoffees.length > 0) {
      coffees = fetchedCoffees
      console.log("Loaded coffees from Supabase:", coffees.length)
    } else {
      console.log("No coffees found in Supabase")
      coffees = []
    }

    // Update coffeeIds for roasteries
    roasteries.forEach((roastery) => {
      roastery.coffeeIds = coffees.filter((coffee) => coffee.roasteryId === roastery.id).map((coffee) => coffee.id)
    })

    console.log("Data initialized successfully")
  } catch (error) {
    console.error("Error initializing data:", error)
    // Keep empty arrays if there's an error
    roasteries = []
    coffees = []
  }
}

// Helper functions
export async function getCoffeesByRoastery(roasteryId: string | number): Promise<Coffee[]> {
  try {
    // Try to fetch from Supabase first
    const fetchedCoffees = await fetchCoffeesByRoasteryId(roasteryId)

    if (fetchedCoffees.length > 0) {
      return fetchedCoffees
    }

    // Fallback to local data if Supabase fetch fails or returns empty
    return coffees.filter((coffee) => coffee.roasteryId === roasteryId)
  } catch (error) {
    console.error("Error in getCoffeesByRoastery:", error)
    // Fallback to local data
    return coffees.filter((coffee) => coffee.roasteryId === roasteryId)
  }
}

export function getRoasteryById(id: string | number): Roastery | undefined {
  const stringId = id.toString()
  return roasteries.find(
    (roastery) =>
      roastery.id === id || roastery.id === Number.parseInt(stringId) || roastery.id.toString() === stringId,
  )
}

export function getCoffeeById(id: string | number): Coffee | undefined {
  const stringId = id.toString()
  return coffees.find(
    (coffee) => coffee.id === id || coffee.id === Number.parseInt(stringId) || coffee.id.toString() === stringId,
  )
}

export function getRoasteryForCoffee(coffee: Coffee): Roastery | undefined {
  return getRoasteryById(coffee.roasteryId)
}

// Calculate coffee rating based on user reviews
export function calculateCoffeeRating(coffeeId: string): { rating: number; ratingCount: number } {
  // For now, return a random rating between 3.5 and 5.0
  // In a real app, this would be calculated from user ratings in the database
  const randomRating = 3.5 + Math.random() * 1.5
  const randomCount = Math.floor(Math.random() * 50) + 5

  return {
    rating: Number.parseFloat(randomRating.toFixed(1)),
    ratingCount: randomCount,
  }
}

// Function to get coffee with calculated rating
export function getCoffeeWithRating(coffeeId: string): CoffeeWithRating {
  const coffee = getCoffeeById(coffeeId)

  if (!coffee) {
    throw new Error(`Coffee with ID ${coffeeId} not found`)
  }

  const { rating, ratingCount } = calculateCoffeeRating(coffeeId)

  return {
    ...coffee,
    rating,
    ratingCount,
  }
}

// Function to get all coffees with calculated ratings
export function getAllCoffeesWithRatings(): CoffeeWithRating[] {
  return coffees.map((coffee) => {
    const { rating, ratingCount } = calculateCoffeeRating(coffee.id)
    return {
      ...coffee,
      rating,
      ratingCount,
    }
  })
}

// User authentication functions
export function getUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username)
}

export function authenticateUser(username: string, password: string): User | null {
  const user = getUserByUsername(username)
  if (user && user.password === password) {
    // In a real app, you would compare hashed passwords
    return user
  }
  return null
}

export function getUserCoffeeRelationship(userId: number, coffeeId: string | number): UserCoffee | undefined {
  const stringCoffeeId = coffeeId.toString()
  return userCoffees.find(
    (uc) =>
      uc.userId === userId &&
      (uc.coffeeId === coffeeId ||
        uc.coffeeId === Number.parseInt(stringCoffeeId) ||
        uc.coffeeId.toString() === stringCoffeeId),
  )
}

export function getUserCoffees(userId: number): Coffee[] {
  const userCoffeeIds = userCoffees.filter((uc) => uc.userId === userId && uc.inCollection).map((uc) => uc.coffeeId)

  return coffees.filter((coffee) => userCoffeeIds.includes(coffee.id))
}

export function getWishlistCoffees(userId: number): Coffee[] {
  const userWishlistIds = userCoffees.filter((uc) => uc.userId === userId && uc.inWishlist).map((uc) => uc.coffeeId)

  return coffees.filter((coffee) => userWishlistIds.includes(coffee.id))
}

export function getCoffeeWithUserData(coffeeId: number, userId: number): Coffee & Partial<UserCoffee> {
  const coffee = getCoffeeById(coffeeId)
  const userCoffee = getUserCoffeeRelationship(userId, coffeeId)

  if (!coffee) {
    throw new Error(`Coffee with ID ${coffeeId} not found`)
  }

  return {
    ...coffee,
    ...(userCoffee || { inCollection: false, inWishlist: false }),
  }
}

// Function to add a new user (for registration)
export function addUser(username: string, password: string, email?: string, name?: string): User {
  // Check if username already exists
  if (getUserByUsername(username)) {
    throw new Error("Username already exists")
  }

  // Create new user
  const newUser: User = {
    id: users.length + 1,
    username,
    password, // In a real app, this would be hashed
    email,
    name,
  }

  // Add to users array
  users.push(newUser)

  return newUser
}

// Function to update user-coffee relationship
export function updateUserCoffeeRelationship(
  userId: number,
  coffeeId: number,
  data: Partial<Omit<UserCoffee, "userId" | "coffeeId">> & {
    purchaseHistory?: "append"
    purchaseData?: PurchaseHistory
  },
): UserCoffee {
  const index = userCoffees.findIndex((uc) => uc.userId === userId && uc.coffeeId === coffeeId)

  // Handle special case for appending to purchase history
  if (data.purchaseHistory === "append" && data.purchaseData) {
    const purchaseData = data.purchaseData

    // Remove these special properties before spreading into the update
    const { purchaseHistory, purchaseData: _, ...restData } = data

    if (index >= 0) {
      // Update existing relationship
      const currentHistory = userCoffees[index].purchaseHistory || []
      userCoffees[index] = {
        ...userCoffees[index],
        ...restData,
        purchaseHistory: [...currentHistory, purchaseData],
      }
      return userCoffees[index]
    } else {
      // Create new relationship
      const newRelationship: UserCoffee = {
        userId,
        coffeeId,
        inCollection: restData.inCollection ?? true, // Default to true when adding purchase
        inWishlist: restData.inWishlist ?? false,
        purchaseHistory: [purchaseData],
        ...restData,
      }
      userCoffees.push(newRelationship)
      return newRelationship
    }
  }

  // Normal update without special purchase history handling
  if (index >= 0) {
    // Update existing relationship
    userCoffees[index] = {
      ...userCoffees[index],
      ...data,
    }
    return userCoffees[index]
  } else {
    // Create new relationship
    const newRelationship: UserCoffee = {
      userId,
      coffeeId,
      inCollection: data.inCollection ?? false,
      inWishlist: data.inWishlist ?? false,
      ...data,
    }
    userCoffees.push(newRelationship)
    return newRelationship
  }
}

// Add freezer-related functions at the end of the file
export function getFreezerEntries(userId: number): (FreezerEntry & { coffee: Coffee })[] {
  const entries = freezerEntries.filter((entry) => entry.userId === userId)

  return entries.map((entry) => {
    // Convert coffeeId to string if needed for comparison
    const coffeeId = typeof entry.coffeeId === "string" ? entry.coffeeId : entry.coffeeId.toString()

    // Find coffee by ID, trying both string and number comparison
    const coffee = coffees.find(
      (c) => c.id === entry.coffeeId || c.id === Number.parseInt(coffeeId) || c.id.toString() === coffeeId,
    )

    if (!coffee) {
      console.error(`Coffee with ID ${entry.coffeeId} not found`)
      // Return a placeholder coffee object instead of throwing an error
      return {
        ...entry,
        coffee: {
          id: entry.coffeeId,
          name: "Unknown Coffee",
          roasteryId: 0,
          image: "/placeholder.svg",
          beanType: "Unknown",
          processing: "Unknown",
          roastLevel: "Unknown",
          suitableFor: ["Unknown"],
          flavorProfile: ["Unknown"],
          prices: [],
        },
      }
    }

    return {
      ...entry,
      coffee,
    }
  })
}

export function addCoffeeToFreezer(
  userId: number,
  coffeeId: number,
  dose: { amount: string; dateAdded: string },
): void {
  const entryIndex = freezerEntries.findIndex((entry) => entry.userId === userId && entry.coffeeId === coffeeId)

  if (entryIndex >= 0) {
    // Coffee already exists in freezer, add new dose
    freezerEntries[entryIndex].doses.push(dose)
  } else {
    // Add new entry
    freezerEntries.push({
      userId,
      coffeeId,
      doses: [dose],
    })
  }
}

export function removeDoseFromFreezer(userId: number, coffeeId: number, doseIndex: number): void {
  const entryIndex = freezerEntries.findIndex((entry) => entry.userId === userId && entry.coffeeId === coffeeId)

  if (entryIndex >= 0) {
    const entry = freezerEntries[entryIndex]

    if (doseIndex >= 0 && doseIndex < entry.doses.length) {
      // Remove the dose
      entry.doses.splice(doseIndex, 1)

      // If no doses left, remove the entire entry
      if (entry.doses.length === 0) {
        freezerEntries.splice(entryIndex, 1)
      }
    }
  }
}

// Export constants from the constants files
export {
  processingColors,
  roastLevelColors,
  suitableForColors,
  flavorColors,
} from "./constants/colors"

export {
  processingMethods,
  processingTypes,
  roastLevels,
  brewingMethods,
  flavorNotes,
  flavorProfiles,
  beanTypes,
} from "./constants/filters"

// Re-export functions from supabase-service
export {
  fetchRoastersFromSupabase,
  fetchCoffeesFromSupabase,
  fetchCoffeesByRoasteryId,
} from "./services/supabase-service"

// Re-export types
export type { Coffee, User } from "./types"

