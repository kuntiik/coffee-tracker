import type { FreezerEntryWithCoffee } from "../types"
import { freezerEntries } from "../data/freezer-entries"
import { getCoffeeById } from "./coffee-service"

// Freezer-related functions
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

