"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type User, authenticateUser, getUserByUsername } from "@/lib/data"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, password: string, email?: string, name?: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Verify the user still exists in our "database"
        const existingUser = getUserByUsername(parsedUser.username)
        if (existingUser) {
          setUser(existingUser)
        } else {
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    const authenticatedUser = authenticateUser(username, password)
    if (authenticatedUser) {
      setUser(authenticatedUser)
      // Save user to localStorage (in a real app, you'd store a token instead)
      localStorage.setItem("user", JSON.stringify(authenticatedUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const register = async (username: string, password: string, email?: string, name?: string) => {
    try {
      // In a real app, this would be an API call
      const newUser = { id: Date.now(), username, password, email, name }

      // Check if username already exists
      if (getUserByUsername(username)) {
        return false
      }

      // In a real app, you would add the user to the database here
      // For now, we'll just simulate success and log in the user
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

