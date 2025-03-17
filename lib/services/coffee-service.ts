import type { Coffee, CoffeeWithRating } from "../types"
import { coffees } from "../data/coffees"
import { userCoffees } from "../data/user-coffees"

// Helper functions for coffee data
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

