import type { FreezerEntry } from "../types"

// Freezer entries data
export const freezerEntries: FreezerEntry[] = [
  {
    userId: 1,
    coffeeId: 1,
    doses: [
      { amount: "100g", dateAdded: "2024-02-15" },
      { amount: "50g", dateAdded: "2024-03-01" },
    ],
  },
  {
    userId: 1,
    coffeeId: 5,
    doses: [{ amount: "200g", dateAdded: "2024-03-10" }],
  },
  {
    userId: 2,
    coffeeId: 2,
    doses: [{ amount: "150g", dateAdded: "2024-02-20" }],
  },
]

