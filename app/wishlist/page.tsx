"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { getWishlistCoffees, updateUserCoffeeRelationship } from "@/lib/data"

export default function WishlistPage() {
  const [coffees, setCoffees] = useState([])
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      // Fetch user's wishlist
      setCoffees(getWishlistCoffees(user.id))
    }
  }, [user, loading, router])

  // If still loading or not authenticated, show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  // If not authenticated, this should not be visible (handled by useEffect redirect)
  if (!user) {
    return null
  }

  const removeFromWishlist = (id: number) => {
    setCoffees(coffees.filter((coffee) => coffee.id !== id))
    // Update in "database"
    updateUserCoffeeRelationship(user.id, id, {
      inWishlist: false,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <p className="text-muted-foreground">Coffee beans you want to try in the future</p>
          </div>

          {coffees.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">Your wishlist is empty</p>
                <p className="mb-4 text-center text-muted-foreground">Add coffees you want to try to your wishlist</p>
                <Link href="/">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Explore Coffee
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coffees.map((coffee) => (
                <Card key={coffee.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{coffee.roastery}</p>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="mb-2 flex flex-wrap gap-1">
                      <Badge variant="outline">{coffee.beanType}</Badge>
                      <Badge variant="outline">{coffee.processing}</Badge>
                      {coffee.flavorProfile.map((flavor) => (
                        <Badge key={flavor} variant="secondary">
                          {flavor}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => removeFromWishlist(coffee.id)}>
                      Remove
                    </Button>
                    <Link href={`/coffee/${coffee.id}`} className="flex-1">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Bean Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

