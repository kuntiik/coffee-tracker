"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Heart, Star, ShoppingCart } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"
import { CoffeeIcon } from "lucide-react"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { useAuth } from "@/lib/auth-context"
import {
  getCoffeeById,
  getRoasteryById,
  getUserCoffeeRelationship,
  updateUserCoffeeRelationship,
  calculateCoffeeRating,
} from "@/lib/data"
import { processingColors, roastLevelColors, suitableForColors } from "@/lib/constants/colors"
import { GiCoffeeBeans } from "react-icons/gi"
import { FreezerDialog } from "@/components/freezer-dialog"
import type { Coffee } from "@/lib/types"

export default function CoffeeDetailPage({ params }: { params: { id: string } }) {
  const coffeeId = params.id
  const [coffee, setCoffee] = useState<Coffee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Fetch coffee data
    const fetchCoffee = async () => {
      try {
        const coffeeData = getCoffeeById(coffeeId)
        if (coffeeData) {
          setCoffee(coffeeData)
        } else {
          setError("Coffee not found")
        }
      } catch (err) {
        console.error("Error fetching coffee:", err)
        setError("Failed to load coffee details")
      } finally {
        setLoading(false)
      }
    }

    fetchCoffee()
  }, [coffeeId])

  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isInCollection, setIsInCollection] = useState(false)
  const [userNotes, setUserNotes] = useState("")
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [personalRating, setPersonalRating] = useState(0)
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([])
  const [coffeeRating, setCoffeeRating] = useState({ rating: 0, ratingCount: 0 })

  useEffect(() => {
    if (coffee) {
      // Calculate coffee rating
      setCoffeeRating(calculateCoffeeRating(coffee.id))
    }
  }, [coffee])

  useEffect(() => {
    if (user && coffee) {
      // Get user-specific data for this coffee
      const userCoffee = getUserCoffeeRelationship(user.id, coffee.id)

      if (userCoffee) {
        setIsInWishlist(userCoffee.inWishlist)
        setIsInCollection(userCoffee.inCollection)
        setUserNotes(userCoffee.userNotes || "")
        setPersonalRating(userCoffee.personalRating || 0)
        setPurchaseHistory(userCoffee.purchaseHistory || [])
      }
    }
  }, [user, coffee])

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  if (error || !coffee) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container py-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="mb-4 h-12 w-12 text-muted-foreground">
                  <CoffeeIcon className="h-full w-full" />
                </div>
                <p className="mb-2 text-lg font-medium">{error || "Coffee not found"}</p>
                <p className="mb-4 text-center text-muted-foreground">
                  The coffee you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/">
                  <Button>View All Coffees</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const roastery = getRoasteryById(coffee.roasteryId)

  const toggleWishlist = () => {
    if (!user) {
      router.push("/login")
      return
    }

    const newWishlistState = !isInWishlist
    setIsInWishlist(newWishlistState)

    // Update in "database"
    updateUserCoffeeRelationship(user.id, coffee.id, {
      inWishlist: newWishlistState,
      // If adding to wishlist and not in collection, ensure it's properly set
      ...(newWishlistState && !isInCollection ? { inCollection: false } : {}),
    })
  }

  const toggleCollection = () => {
    if (!user) {
      router.push("/login")
      return
    }

    const newCollectionState = !isInCollection
    setIsInCollection(newCollectionState)

    // Update in "database"
    updateUserCoffeeRelationship(user.id, coffee.id, {
      inCollection: newCollectionState,
      // If removing from collection, also remove from wishlist
      ...(newCollectionState ? {} : { inWishlist: false }),
    })
  }

  const saveNotes = () => {
    if (!user) return

    // Update in "database"
    updateUserCoffeeRelationship(user.id, coffee.id, {
      userNotes,
    })

    setIsEditingNotes(false)
  }

  const handlePurchaseComplete = () => {
    // Refresh user-coffee data
    if (user) {
      const userCoffee = getUserCoffeeRelationship(user.id, coffee.id)
      if (userCoffee) {
        setIsInCollection(true)
        setPurchaseHistory(userCoffee.purchaseHistory || [])
      }
    }
  }

  // Update the rating functionality to only allow full numbers
  const handleRatingClick = (newRating: number) => {
    setPersonalRating(newRating)
    updateUserCoffeeRelationship(user.id, coffee.id, {
      personalRating: newRating,
    })
    // Recalculate coffee rating after updating personal rating
    setCoffeeRating(calculateCoffeeRating(coffee.id))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          {/* Update the breadcrumb section to not show dashboard link when not logged in */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    User Dashboard
                  </Link>
                  <span className="text-muted-foreground">/</span>
                </>
              ) : null}
              <span>Coffee Details</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {roastery && (
                        <Image
                          src={roastery.logo || "/placeholder.svg"}
                          alt={roastery.name}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <h1 className="text-3xl font-bold">{coffee.name}</h1>
                        {roastery && (
                          <Link
                            href={`/roasters/${encodeURIComponent(roastery.name)}`}
                            className="text-lg text-muted-foreground hover:text-primary"
                          >
                            {roastery.name}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={isInWishlist ? "default" : "outline"}
                        size="icon"
                        onClick={toggleWishlist}
                        className={isInWishlist ? "text-white" : ""}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
                      </Button>
                      {user ? (
                        <>
                          {isInCollection ? (
                            <PurchaseDialog
                              coffeeId={coffee.id}
                              onPurchaseComplete={handlePurchaseComplete}
                              buttonText="Add Purchase"
                              className="w-full"
                            />
                          ) : (
                            <Button
                              variant={isInCollection ? "default" : "outline"}
                              onClick={toggleCollection}
                              className="w-full"
                            >
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              Add to Collection
                            </Button>
                          )}
                          <FreezerDialog coffeeId={coffee.id} buttonText="Add to Freezer" className="w-full" />
                        </>
                      ) : (
                        <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Collection
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={coffee.image || "/placeholder.svg?height=400&width=400"}
                      alt={coffee.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Update the badges display in the detail page with colors */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    <Badge variant="outline">{coffee.beanType}</Badge>
                    <Badge variant="outline" className={processingColors[coffee.processing] || ""}>
                      {coffee.processing}
                    </Badge>
                    <Badge variant="outline" className={roastLevelColors[coffee.roastLevel] || ""}>
                      {coffee.roastLevel}
                    </Badge>
                    {coffee.suitableFor.map((method) => (
                      <Badge key={method} variant="outline" className={suitableForColors[method] || ""}>
                        {method}
                      </Badge>
                    ))}
                    {coffee.flavorProfile.map((flavor) => (
                      <Badge
                        key={flavor}
                        variant="secondary"
                        className="font-medium text-xs rounded-full px-2.5 py-0.5 bg-opacity-80 text-foreground"
                      >
                        {flavor}
                      </Badge>
                    ))}
                  </div>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList>
                      <TabsTrigger value="details" className="flex-1">
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="notes" className="flex-1">
                        Your Notes
                      </TabsTrigger>
                      <TabsTrigger value="purchases" className="flex-1">
                        Purchase History
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 pt-4">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Description</h3>
                        <p className="text-muted-foreground">{coffee.description || "No description available."}</p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <h3 className="mb-2 text-lg font-medium">Origin Information</h3>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>
                              <span className="font-medium text-foreground">Origin:</span>{" "}
                              {coffee.origin || "Not specified"}
                            </li>
                            <li>
                              <span className="font-medium text-foreground">Altitude:</span>{" "}
                              {coffee.altitude || "Not specified"}
                            </li>
                            <li>
                              <span className="font-medium text-foreground">Harvest:</span>{" "}
                              {coffee.harvest || "Not specified"}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="mb-2 text-lg font-medium flex items-center">
                            <GiCoffeeBeans className="h-5 w-5 mr-2" />
                            Pricing
                          </h3>
                          <ul className="space-y-1 text-muted-foreground">
                            {coffee.prices.map((price) => (
                              <li key={price.amount}>
                                <span className="font-medium text-foreground">{price.amount}:</span> ${price.price}
                                {price.currency && ` (${price.currency.toUpperCase()})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Roast & Brewing</h3>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>
                            <span className="font-medium text-foreground">Roast Level:</span> {coffee.roastLevel}
                          </li>
                          <li>
                            <span className="font-medium text-foreground">Suitable For:</span>{" "}
                            {coffee.suitableFor.join(", ")}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Rating</h3>
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(coffeeRating.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                } ${
                                  i === Math.floor(coffeeRating.rating) && coffeeRating.rating % 1 > 0
                                    ? "fill-yellow-400/50"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-muted-foreground">{coffeeRating.rating.toFixed(1)} / 5</span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({coffeeRating.ratingCount} ratings)
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="notes" className="space-y-4 pt-4">
                      {user ? (
                        isInCollection ? (
                          <>
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">Your Notes</h3>
                              <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(!isEditingNotes)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {isEditingNotes ? "Cancel" : "Edit"}
                              </Button>
                            </div>
                            {isEditingNotes ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={userNotes}
                                  onChange={(e) => setUserNotes(e.target.value)}
                                  placeholder="Add your tasting notes or other observations..."
                                  rows={5}
                                />
                                <Button onClick={saveNotes}>Save Notes</Button>
                              </div>
                            ) : (
                              <div>
                                <p className="text-muted-foreground">{userNotes || "No notes added yet."}</p>
                              </div>
                            )}
                            <div>
                              <h3 className="mb-2 text-lg font-medium">Your Rating</h3>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-5 w-5 cursor-pointer ${
                                        i < personalRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                      onClick={() => handleRatingClick(i + 1)}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-muted-foreground">{personalRating} / 5</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="mb-4 text-muted-foreground">
                              Add this coffee to your collection to track your notes and ratings.
                            </p>
                            <Button onClick={toggleCollection}>Add to Collection</Button>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <p className="mb-4 text-muted-foreground">Please log in to add notes and ratings.</p>
                          <Link href="/login">
                            <Button>Log In</Button>
                          </Link>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="purchases" className="space-y-4 pt-4">
                      {user ? (
                        isInCollection ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-medium flex items-center">
                                  <GiCoffeeBeans className="h-5 w-5 mr-2" />
                                  Purchase History
                                  {purchaseHistory.length > 0 && (
                                    <span className="ml-2 text-sm inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                      {purchaseHistory.length}×
                                    </span>
                                  )}
                                </h3>
                                <PurchaseDialog
                                  coffeeId={coffee.id}
                                  onPurchaseComplete={handlePurchaseComplete}
                                  variant="default"
                                  buttonText="Add Purchase"
                                />
                              </div>
                              <p className="text-muted-foreground">
                                You've purchased this coffee{" "}
                                <span className="font-medium">{purchaseHistory.length}</span> times.
                              </p>

                              {purchaseHistory.length > 0 ? (
                                <div className="mt-4 space-y-4">
                                  <h4 className="font-medium">All Purchases:</h4>
                                  <div className="rounded-md border">
                                    <div className="grid grid-cols-3 border-b bg-muted px-4 py-2 font-medium">
                                      <div>Date</div>
                                      <div>Amount</div>
                                      <div>Price</div>
                                    </div>
                                    {purchaseHistory.map((purchase, index) => (
                                      <div key={index} className="grid grid-cols-3 px-4 py-3 border-b last:border-0">
                                        <div>{purchase.date}</div>
                                        <div>{purchase.amount}</div>
                                        <div>${purchase.price}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="mt-4 flex flex-col items-center justify-center py-4 text-center">
                                  <p className="mb-4 text-muted-foreground">
                                    No purchase history available. Add your first purchase!
                                  </p>
                                  <PurchaseDialog
                                    coffeeId={coffee.id}
                                    onPurchaseComplete={handlePurchaseComplete}
                                    buttonText="Record First Purchase"
                                  />
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="mb-4 text-muted-foreground">
                              Add this coffee to your collection to track your purchase history.
                            </p>
                            <Button onClick={toggleCollection}>Add to Collection</Button>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <p className="mb-4 text-muted-foreground">Please log in to track your purchase history.</p>
                          <Link href="/login">
                            <Button>Log In</Button>
                          </Link>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
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

