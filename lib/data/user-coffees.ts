import type { UserCoffee } from "../types"

// User-Coffee relationships
export const userCoffees: UserCoffee[] = [
  // Demo user's collection
  {
    userId: 1,
    coffeeId: 1,
    userNotes: "Bright and floral with a clean finish. One of my favorites!",
    purchaseHistory: [
      { date: "2023-12-15", amount: "250g", price: 16.99 },
      { date: "2024-01-20", amount: "500g", price: 29.99 },
      { date: "2024-02-28", amount: "250g", price: 16.99 },
    ],
    personalRating: 5,
    inCollection: true,
    inWishlist: false,
  },
  {
    userId: 1,
    coffeeId: 3,
    userNotes: "Interesting earthy notes, but a bit too intense for everyday drinking.",
    purchaseHistory: [{ date: "2024-01-20", amount: "250g", price: 17.99 }],
    personalRating: 3,
    inCollection: true,
    inWishlist: false,
  },
  {
    userId: 1,
    coffeeId: 5,
    userNotes: "Great balance of chocolate and spice. Makes an excellent morning cup.",
    purchaseHistory: [
      { date: "2024-02-05", amount: "250g", price: 16.49 },
      { date: "2024-03-10", amount: "500g", price: 28.99 },
    ],
    personalRating: 4,
    inCollection: true,
    inWishlist: false,
  },
  {
    userId: 1,
    coffeeId: 2,
    inCollection: false,
    inWishlist: true,
  },
  {
    userId: 1,
    coffeeId: 4,
    inCollection: false,
    inWishlist: true,
  },
  {
    userId: 1,
    coffeeId: 6,
    inCollection: false,
    inWishlist: true,
  },

  // Alice's collection
  {
    userId: 2,
    coffeeId: 2,
    userNotes: "Smooth and balanced. Perfect for my morning routine.",
    purchaseHistory: [
      { date: "2024-01-10", amount: "250g", price: 15.99 },
      { date: "2024-02-15", amount: "500g", price: 27.99 },
    ],
    personalRating: 5,
    inCollection: true,
    inWishlist: false,
  },
  {
    userId: 2,
    coffeeId: 7,
    userNotes: "Rich and complex. Great as espresso.",
    purchaseHistory: [{ date: "2024-02-20", amount: "250g", price: 15.99 }],
    personalRating: 4,
    inCollection: true,
    inWishlist: false,
  },
  {
    userId: 2,
    coffeeId: 1,
    inCollection: false,
    inWishlist: true,
    personalRating: 4,
  },
  {
    userId: 2,
    coffeeId: 9,
    inCollection: false,
    inWishlist: true,
  },
]

