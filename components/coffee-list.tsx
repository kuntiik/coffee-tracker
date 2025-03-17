"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Star, CoffeeIcon } from "lucide-react"
import { GiCoffeeBeans } from "react-icons/gi"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { useAuth } from "@/lib/auth-context"
import {
  type Coffee,
  getRoasteryById,
  updateUserCoffeeRelationship,
  getUserCoffeeRelationship,
  calculateCoffeeRating,
} from "@/lib/data"
import { processingColors, roastLevelColors } from "@/lib/constants/colors"
import { Skeleton } from "@/components/ui/skeleton"

interface CoffeeListProps {
  coffees: Coffee[]
  isLoading?: boolean
}

export function CoffeeList({ coffees, isLoading = false }: CoffeeListProps) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [coffeeRatings, setCoffeeRatings] = useState<Record<string, { rating: number; ratingCount: number }>>({})
  const { user } = useAuth()
  const router = useRouter()

  // Calculate ratings for all coffees
  useEffect(() => {
    const ratings: Record<string, { rating: number; ratingCount: number }> = {}

    coffees.forEach((coffee) => {
      ratings[coffee.id] = calculateCoffeeRating(coffee.id)
    })

    setCoffeeRatings(ratings)
  }, [coffees])

  useEffect(() => {
    // Initialize wishlist from user data
    if (user) {
      const userWishlist = coffees
        .filter((coffee) => {
          const relationship = getUserCoffeeRelationship(user.id, coffee.id)
          return relationship?.inWishlist
        })
        .map((coffee) => coffee.id)

      setWishlist(userWishlist)
    }
  }, [user, coffees])

  const toggleWishlist = (id: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id))
      // Update in "database"
      updateUserCoffeeRelationship(user.id, id, {
        inWishlist: false,
      })
    } else {
      setWishlist([...wishlist, id])
      // Update in "database"
      updateUserCoffeeRelationship(user.id, id, {
        inWishlist: true,
      })
    }
  }

  const handlePurchaseComplete = () => {
    // Refresh the page or update state as needed
    // For now, we'll just log a message
    console.log("Purchase added successfully")
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full ml-1" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <div className="relative aspect-square mx-6">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
            <CardContent className="pt-4 pb-3">
              <div className="flex flex-wrap gap-1 mb-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (coffees.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="mb-4 h-12 w-12 text-muted-foreground">
            <CoffeeIcon className="h-full w-full" />
          </div>
          <p className="mb-2 text-lg font-medium">No coffees found</p>
          <p className="text-center text-muted-foreground">Try adjusting your search terms or filters</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {coffees.map((coffee) => {
        const roastery = getRoasteryById(coffee.roasteryId)
        const rating = coffeeRatings[coffee.id] || { rating: 0, ratingCount: 0 }

        return (
          <Card key={coffee.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {roastery && (
                    <Image
                      src={roastery.logo || "/placeholder.svg?height=30&width=30"}
                      alt={roastery.name}
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                    />
                  )}
                  <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
                </div>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => toggleWishlist(coffee.id)}
                  >
                    <Heart className={`h-4 w-4 ${wishlist.includes(coffee.id) ? "fill-red-500 text-red-500" : ""}`} />
                    <span className="sr-only">Add to wishlist</span>
                  </Button>
                  <PurchaseDialog coffeeId={coffee.id} onPurchaseComplete={handlePurchaseComplete} variant="icon" />
                </div>
              </div>
              {roastery && (
                <Link
                  href={`/roasters/${encodeURIComponent(roastery.name)}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {roastery.name}
                </Link>
              )}
            </CardHeader>
            <div className="relative aspect-square mx-6 rounded-md overflow-hidden bg-muted">
              <Image
                src={coffee.image || "/placeholder.svg?height=300&width=300"}
                alt={coffee.name}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <CardContent className="pt-4 pb-3">
              <div className="mb-2 flex flex-wrap gap-1">
                <Badge variant="outline">{coffee.beanType}</Badge>
                <Badge variant="outline" className={processingColors[coffee.processing] || ""}>
                  {coffee.processing}
                </Badge>
                <Badge variant="outline" className={roastLevelColors[coffee.roastLevel] || ""}>
                  {coffee.roastLevel}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="text-sm font-medium">Flavor Profile:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {coffee.flavorProfile.slice(0, 3).map((flavor) => (
                    <Badge
                      key={flavor}
                      variant="secondary"
                      className="font-medium text-xs rounded-full px-2.5 py-0.5 bg-opacity-80 text-foreground"
                    >
                      {flavor}
                    </Badge>
                  ))}
                  {coffee.flavorProfile.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{coffee.flavorProfile.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GiCoffeeBeans className="h-4 w-4 mr-1" />
                  <div className="text-sm">
                    {(() => {
                      // Try to find the 250g price first
                      const price250g = coffee.prices.find((p) => p.amount === "250g")
                      // If not found, get the smallest amount (sort by numeric value)
                      const smallestPrice =
                        price250g ||
                        coffee.prices.sort((a, b) => {
                          const aValue = Number.parseInt(a.amount.replace(/\D/g, ""))
                          const bValue = Number.parseInt(b.amount.replace(/\D/g, ""))
                          return aValue - bValue
                        })[0]

                      return `${smallestPrice.amount}: ${smallestPrice.price} ${smallestPrice.currency || "USD"}`
                    })()}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      } ${i === Math.floor(rating.rating) && rating.rating % 1 > 0 ? "fill-yellow-400/50" : ""}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">{rating.rating.toFixed(1)}</span>
                <span className="ml-1 text-xs text-muted-foreground">({rating.ratingCount})</span>
              </div>
              {user &&
                (() => {
                  const userCoffeeData = getUserCoffeeRelationship(user.id, coffee.id)
                  if (userCoffeeData) {
                    return (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {userCoffeeData.purchaseHistory?.length > 0 && (
                          <span>You bought: {userCoffeeData.purchaseHistory.length}x</span>
                        )}
                        {userCoffeeData.personalRating > 0 && (
                          <span className="flex items-center">
                            Your rating:
                            <Star className="ml-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="ml-0.5">{userCoffeeData.personalRating}</span>
                          </span>
                        )}
                      </div>
                    )
                  }
                  return null
                })()}
            </CardContent>
            <CardFooter>
              <Link href={`/coffee/${coffee.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

