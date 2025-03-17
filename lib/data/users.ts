import type { User } from "../types"

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

