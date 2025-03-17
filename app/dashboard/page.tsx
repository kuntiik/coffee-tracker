"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Plus, Star, Minus, ThermometerSnowflake } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { CoffeeIcon } from "lucide-react"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { useAuth } from "@/lib/auth-context"
import {
  getUserCoffees,
  getWishlistCoffees,
  getRoasteryById,
  getUserCoffeeRelationship,
  getCoffeeById,
  getFreezerEntries,
  removeDoseFromFreezer,
  calculateCoffeeRating,
} from "@/lib/data"
import { FreezerDialog } from "@/components/freezer-dialog"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("collection")
  const [userCoffees, setUserCoffees] = useState([])
  const [wishlistCoffees, setWishlistCoffees] = useState([])
  const [freezerEntries, setFreezerEntries] = useState([])
  const [coffeeRatings, setCoffeeRatings] = useState({})
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      // Fetch user's coffee collection, wishlist, and freezer entries
      const coffees = getUserCoffees(user.id)
      const wishlist = getWishlistCoffees(user.id)
      setUserCoffees(coffees)
      setWishlistCoffees(wishlist)

      try {
        const entries = getFreezerEntries(user.id)
        setFreezerEntries(entries)
      } catch (error) {
        console.error("Error fetching freezer entries:", error)
        setFreezerEntries([])
      }

      // Calculate ratings for all coffees
      const ratings = {}
      const allCoffees = [...coffees, ...wishlist]
      allCoffees.forEach((coffee) => {
        ratings[coffee.id] = calculateCoffeeRating(coffee.id)
      })
      setCoffeeRatings(ratings)
    }
  }, [user, loading, router])

  // If still loading or not authenticated, show loading state
  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  const handlePurchaseComplete = () => {
    // Refresh data
    setUserCoffees(getUserCoffees(user.id))
    setWishlistCoffees(getWishlistCoffees(user.id))
  }

  const handleRemoveDose = (coffeeId: number, doseIndex: number) => {
    if (!user) return

    removeDoseFromFreezer(user.id, coffeeId, doseIndex)
    setFreezerEntries(getFreezerEntries(user.id))
  }

  const handleRefreshFreezerEntries = () => {
    if (user) {
      setFreezerEntries(getFreezerEntries(user.id))
    }
  }

  // Group freezer entries by coffee and dose amount
  const groupedFreezerEntries = freezerEntries.reduce((acc, entry) => {
    // Group doses by amount
    const dosesByAmount = entry.doses.reduce((doseAcc, dose) => {
      if (!doseAcc[dose.amount]) {
        doseAcc[dose.amount] = []
      }
      doseAcc[dose.amount].push(dose)
      return doseAcc
    }, {})

    return [
      ...acc,
      {
        ...entry,
        groupedDoses: Object.entries(dosesByAmount).map(([amount, doses]) => ({
          amount,
          count: doses.length,
          doses,
        })),
      },
    ]
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Your Coffee Dashboard</h1>
            <p className="text-muted-foreground">Track your coffee journey and manage your collection</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="collection">My Collection</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="freezer">Freezer</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="collection" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Your Coffee Collection</h2>
                <Link href="/add-coffee">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Coffee
                  </Button>
                </Link>
              </div>

              {userCoffees.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">Your collection is empty</p>
                    <p className="mb-4 text-center text-muted-foreground">
                      Start tracking your coffee journey by adding beans to your collection
                    </p>
                    <Link href="/add-coffee">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Coffee
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {userCoffees.map((coffee) => {
                    const roastery = getRoasteryById(coffee.roasteryId)
                    const userCoffeeData = getUserCoffeeRelationship(user.id, coffee.id)
                    const rating = coffeeRatings[coffee.id] || { rating: 0, ratingCount: 0 }

                    return (
                      <Card key={coffee.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
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
                                <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
                                {roastery && (
                                  <Link
                                    href={`/roasteries/${encodeURIComponent(roastery.name)}`}
                                    className="text-sm text-muted-foreground hover:text-primary"
                                  >
                                    {roastery.name}
                                  </Link>
                                )}
                              </div>
                            </div>
                            <div className="flex">
                              <PurchaseDialog
                                coffeeId={coffee.id}
                                onPurchaseComplete={handlePurchaseComplete}
                                variant="icon"
                              />
                              <FreezerDialog
                                coffeeId={coffee.id}
                                onComplete={handleRefreshFreezerEntries}
                                variant="icon"
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <div className="relative aspect-video px-6">
                          <Image
                            src={coffee.image || "/placeholder.svg"}
                            alt={coffee.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <CardContent className="pt-4 pb-3">
                          <div className="mb-2 flex flex-wrap gap-1">
                            <Badge variant="outline">{coffee.beanType}</Badge>
                            <Badge variant="outline">{coffee.processing}</Badge>
                            {coffee.flavorProfile.map((flavor) => (
                              <Badge key={flavor} variant="secondary">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">
                              Purchased {userCoffeeData?.purchaseHistory?.length || 0} times
                            </div>
                            <div className="mt-2">
                              <div className="text-sm font-medium">Notes:</div>
                              <p className="text-sm text-muted-foreground">
                                {userCoffeeData?.userNotes || "No notes added."}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(rating.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  } ${
                                    i === Math.floor(rating.rating) && rating.rating % 1 > 0 ? "fill-yellow-400/50" : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">{rating.rating.toFixed(1)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({rating.ratingCount})</span>
                          </div>
                          {userCoffeeData?.personalRating > 0 && (
                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                              Your rating:
                              <Star className="ml-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-0.5">{userCoffeeData.personalRating}</span>
                            </div>
                          )}
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
              )}
            </TabsContent>
            <TabsContent value="wishlist" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Your Wishlist</h2>
                <Link href="/">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Explore More Coffee
                  </Button>
                </Link>
              </div>

              {wishlistCoffees.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">Your wishlist is empty</p>
                    <p className="mb-4 text-center text-muted-foreground">
                      Add coffees you want to try to your wishlist
                    </p>
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
                  {wishlistCoffees.map((coffee) => {
                    const roastery = getRoasteryById(coffee.roasteryId)
                    const rating = coffeeRatings[coffee.id] || { rating: 0, ratingCount: 0 }

                    return (
                      <Card key={coffee.id}>
                        <CardHeader className="pb-3">
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
                              <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
                              {roastery && (
                                <Link
                                  href={`/roasteries/${encodeURIComponent(roastery.name)}`}
                                  className="text-sm text-muted-foreground hover:text-primary"
                                >
                                  {roastery.name}
                                </Link>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <div className="relative aspect-video px-6">
                          <Image
                            src={coffee.image || "/placeholder.svg"}
                            alt={coffee.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <CardContent className="pt-4 pb-3">
                          <div className="mb-2 flex flex-wrap gap-1">
                            <Badge variant="outline">{coffee.beanType}</Badge>
                            <Badge variant="outline">{coffee.processing}</Badge>
                            {coffee.flavorProfile.map((flavor) => (
                              <Badge key={flavor} variant="secondary">
                                {flavor}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(rating.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  } ${
                                    i === Math.floor(rating.rating) && rating.rating % 1 > 0 ? "fill-yellow-400/50" : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">{rating.rating.toFixed(1)}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({rating.ratingCount})</span>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Link href={`/coffee/${coffee.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <PurchaseDialog
                            coffeeId={coffee.id}
                            onPurchaseComplete={handlePurchaseComplete}
                            buttonText="Bought"
                            className="flex-1"
                          />
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="freezer" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Your Coffee Freezer</h2>
                <FreezerDialog onComplete={handleRefreshFreezerEntries} buttonText="Add Coffee to Freezer" />
              </div>

              {freezerEntries.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <ThermometerSnowflake className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">Your freezer is empty</p>
                    <p className="mb-4 text-center text-muted-foreground">
                      Store your coffee beans in the freezer to preserve freshness
                    </p>
                    <FreezerDialog onComplete={handleRefreshFreezerEntries} buttonText="Add Your First Coffee" />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedFreezerEntries.map((entry) => {
                    const roastery = getRoasteryById(entry.coffee.roasteryId)

                    return (
                      <Card key={entry.coffeeId}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
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
                                <CardTitle className="line-clamp-1">{entry.coffee.name}</CardTitle>
                                {roastery && (
                                  <Link
                                    href={`/roasteries/${encodeURIComponent(roastery.name)}`}
                                    className="text-sm text-muted-foreground hover:text-primary"
                                  >
                                    {roastery.name}
                                  </Link>
                                )}
                              </div>
                            </div>
                            <FreezerDialog
                              coffeeId={entry.coffeeId}
                              onComplete={handleRefreshFreezerEntries}
                              variant="icon"
                            />
                          </div>
                        </CardHeader>
                        <div className="relative aspect-video px-6">
                          <Image
                            src={entry.coffee.image || "/placeholder.svg"}
                            alt={entry.coffee.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <CardContent className="pt-4 pb-3">
                          <div className="mb-2 flex flex-wrap gap-1">
                            <Badge variant="outline">{entry.coffee.beanType}</Badge>
                            <Badge variant="outline">{entry.coffee.processing}</Badge>
                            <Badge variant="outline">{entry.coffee.roastLevel}</Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Doses in Freezer:</div>
                            <div className="space-y-2">
                              {entry.groupedDoses.map((group, groupIndex) => (
                                <div key={groupIndex} className="rounded-md border p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <ThermometerSnowflake className="h-4 w-4" />
                                      <span className="font-medium">{group.amount}</span>
                                      <Badge variant="secondary" className="ml-1">
                                        {group.count} {group.count === 1 ? "dose" : "doses"}
                                      </Badge>
                                    </div>
                                    <FreezerDialog
                                      coffeeId={entry.coffeeId}
                                      onComplete={handleRefreshFreezerEntries}
                                      variant="icon"
                                    />
                                  </div>
                                  <div className="space-y-1 mt-2">
                                    {group.doses.map((dose, doseIndex) => {
                                      // Find the original index in the full doses array
                                      const originalIndex = entry.doses.findIndex(
                                        (d) => d.amount === dose.amount && d.dateAdded === dose.dateAdded,
                                      )

                                      return (
                                        <div key={doseIndex} className="flex items-center justify-between text-sm">
                                          <span className="text-xs text-muted-foreground">Added: {dose.dateAdded}</span>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleRemoveDose(entry.coffeeId, originalIndex)}
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link href={`/coffee/${entry.coffeeId}`} className="w-full">
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
            <TabsContent value="timeline" className="space-y-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Your Coffee Timeline</h2>
              </div>

              {userCoffees.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">No purchase history</p>
                    <p className="mb-4 text-center text-muted-foreground">
                      Add coffees to your collection to see your purchase timeline
                    </p>
                    <Link href="/add-coffee">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Coffee
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {/* Create a timeline of all purchases sorted by date */}
                  {(() => {
                    // Get all user-coffee relationships for this user
                    const userCoffeeRelationships = userCoffees
                      .map((coffee) => getUserCoffeeRelationship(user.id, coffee.id))
                      .filter(Boolean)

                    // Flatten all purchase histories into a single array
                    const allPurchases = userCoffeeRelationships.flatMap((userCoffee) =>
                      (userCoffee?.purchaseHistory || []).map((purchase) => ({
                        ...purchase,
                        coffeeId: userCoffee.coffeeId,
                        coffeeName: getCoffeeById(userCoffee.coffeeId)?.name || "Unknown Coffee",
                        roasteryId: getCoffeeById(userCoffee.coffeeId)?.roasteryId,
                        image: getCoffeeById(userCoffee.coffeeId)?.image || "/placeholder.svg",
                      })),
                    )

                    // Sort by date (newest first)
                    allPurchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

                    // Group by month/year
                    const purchasesByMonth = allPurchases.reduce((acc, purchase) => {
                      const date = new Date(purchase.date)
                      const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

                      if (!acc[monthYear]) {
                        acc[monthYear] = []
                      }

                      acc[monthYear].push(purchase)
                      return acc
                    }, {})

                    if (Object.keys(purchasesByMonth).length === 0) {
                      return (
                        <Card>
                          <CardContent className="flex flex-col items-center justify-center py-10">
                            <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-2 text-lg font-medium">No purchase history</p>
                            <p className="text-center text-muted-foreground">
                              Add purchase dates to your coffees to see them in your timeline
                            </p>
                          </CardContent>
                        </Card>
                      )
                    }

                    return Object.entries(purchasesByMonth).map(([monthYear, purchases]) => (
                      <div key={monthYear} className="space-y-4">
                        <h3 className="text-lg font-medium">{monthYear}</h3>
                        <div className="space-y-4">
                          {purchases.map((purchase, index) => {
                            const roastery = getRoasteryById(purchase.roasteryId)
                            return (
                              <Card key={`${purchase.coffeeId}-${index}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                      <Image
                                        src={purchase.image || "/placeholder.svg"}
                                        alt={purchase.coffeeName}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        {roastery && (
                                          <Image
                                            src={roastery.logo || "/placeholder.svg"}
                                            alt={roastery.name}
                                            width={20}
                                            height={20}
                                            className="rounded-full"
                                          />
                                        )}
                                        <Link
                                          href={`/coffee/${purchase.coffeeId}`}
                                          className="font-medium hover:text-primary"
                                        >
                                          {purchase.coffeeName}
                                        </Link>
                                      </div>
                                      {roastery && <p className="text-sm text-muted-foreground">{roastery.name}</p>}
                                      <div className="mt-1 flex items-center gap-4 text-sm">
                                        <span>{purchase.date}</span>
                                        <span>{purchase.amount}</span>
                                        <span>${purchase.price}</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>
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

