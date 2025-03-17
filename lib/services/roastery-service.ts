import type { Roastery } from "../types"
import { roasteries } from "../data/roasteries"
import { getCoffeeById } from "./coffee-service"
import type { Coffee } from "../types"
import { coffees } from "../data/coffees"

// Helper functions for roastery data
export function getRoasteryById(id: number): Roastery | undefined {
  return roasteries.find((roastery) => roastery.id === id)
}

export function getRoasteryForCoffeeId(coffeeId: number): Roastery | undefined {
  const coffee = getCoffeeById(coffeeId)
  if (!coffee) return undefined
  return getRoasteryById(coffee.roasteryId)
}

// Update coffeeIds for roasteries based on current coffees
export function updateRoasteryCoffeeIds(): void {
  roasteries.forEach((roastery) => {
    roastery.coffeeIds = getCoffeesByRoasteryId(roastery.id).map((coffee) => coffee.id)
  })
}

// Get all coffees for a roastery
export function getCoffeesByRoasteryId(roasteryId: number): Coffee[] {
  return coffees.filter((coffee) => coffee.roasteryId === roasteryId)
}

