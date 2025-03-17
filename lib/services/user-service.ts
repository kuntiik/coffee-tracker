import type { User, UserCoffee, Coffee, PurchaseHistory } from "../types"
import { users } from "../data/users"
import { userCoffees } from "../data/user-coffees"
import { coffees } from "../data/coffees"

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

// User-specific coffee data functions
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
  const coffee = coffees.find((c) => c.id === coffeeId)
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

