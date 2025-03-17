import type {
  Coffee,
  Roastery,
  User,
  UserCoffee,
  PurchaseHistory,
  CoffeeWithRating,
  FreezerEntryWithCoffee,
} from "./types"
import { users, userCoffees, freezerEntries } from "./data/user-data"
import { coffees, roasteries } from "./data"

// Coffee-related services
export function getCoffeeById(id: number): Coffee | undefined {
  return coffees.find((coffee) => coffee.id === id)
}

export function getCoffeesByRoastery(roasteryId: number): Coffee[] {
  return coffees.filter((coffee) => coffee.roasteryId === roasteryId)
}

// Function to calculate coffee rating based on user reviews
export function calculateCoffeeRating(coffeeId: number): { rating: number; ratingCount: number } {
  const coffeeRatings = userCoffees
    .filter((uc) => uc.coffeeId === coffeeId && typeof uc.personalRating === "number")
    .map((uc) => uc.personalRating as number)

  if (coffeeRatings.length === 0) {
    return { rating: 0, ratingCount: 0 }
  }

  const totalRating = coffeeRatings.reduce((sum, rating) => sum + rating, 0)
  const averageRating = totalRating / coffeeRatings.length

  return {
    rating: Number.parseFloat(averageRating.toFixed(1)),
    ratingCount: coffeeRatings.length,
  }
}

// Function to get coffee with calculated rating
export function getCoffeeWithRating(coffeeId: number): CoffeeWithRating {
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

// Roastery-related services
export function getRoasteryById(id: number): Roastery | undefined {
  return roasteries.find((roastery) => roastery.id === id)
}

export function getRoasteryForCoffee(coffee: Coffee): Roastery | undefined {
  return getRoasteryById(coffee.roasteryId)
}

// User-related services
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

// User-coffee relationship services
export function getUserCoffeeRelationship(userId: number, coffeeId: number): UserCoffee | undefined {
  return userCoffees.find((uc) => uc.userId === userId && uc.coffeeId === coffeeId)
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

// Freezer-related services
export function getFreezerEntries(userId: number): FreezerEntryWithCoffee[] {
  const entries = freezerEntries.filter((entry) => entry.userId === userId)

  return entries.map((entry) => {
    const coffee = getCoffeeById(entry.coffeeId)
    if (!coffee) {
      throw new Error(`Coffee with ID ${entry.coffeeId} not found`)
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

