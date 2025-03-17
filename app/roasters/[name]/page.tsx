"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Heart, MapPin, Star, Calendar, Globe, Coffee, ArrowLeft } from "lucide-react"
import { GiCoffeeBeans } from "react-icons/gi"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { CoffeeIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { roasteries, getCoffeesByRoastery, initializeData } from "@/lib/data"
import { processingColors, roastLevelColors } from "@/lib/constants/colors"

export default function RoasteryPage({ params }: { params: { name: string } }) {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localRoasteries, setLocalRoasteries] = useState(roasteries)
  const [roasteryCoffees, setRoasteryCoffees] = useState<any[]>([])
  const decodedName = decodeURIComponent(params.name)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await initializeData()
        setLocalRoasteries(roasteries)

        const roastery = roasteries.find((r) => r.name === decodedName)
        if (roastery) {
          const coffees = await getCoffeesByRoastery(roastery.id)
          setRoasteryCoffees(coffees)
        }
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [decodedName])

  const toggleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id))
    } else {
      setWishlist([...wishlist, id])
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container py-6">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/roasters" className="text-muted-foreground hover:text-foreground flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Roasters
              </Link>
            </div>
            <div className="relative h-64 w-full md:h-80 rounded-lg overflow-hidden mb-8">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row mb-8">
              <Skeleton className="h-32 w-32 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />

            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <div className="px-6">
                    <Skeleton className="h-48 w-full rounded-md" />
                  </div>
                  <CardContent className="pt-4">
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
          </div>
        </main>
      </div>
    )
  }

  const roastery = localRoasteries.find((r) => r.name === decodedName)

  if (!roastery) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="container py-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">Roaster not found</p>
                <p className="mb-4 text-center text-muted-foreground">
                  The roaster you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/roasters">
                  <Button>View All Roasters</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="flex items-center gap-2 container py-4">
          <Link href="/roasters" className="text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Roasters
          </Link>
        </div>

        <div className="relative h-64 w-full md:h-80">
          <Image
            src={roastery.coverImage || "/placeholder.svg?height=400&width=1200"}
            alt={roastery.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative -mt-20 py-6">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border-4 border-background bg-background shadow-md">
              <Image
                src={roastery.logo || "/placeholder.svg?height=100&width=100"}
                alt={roastery.name}
                fill
                className="object-cover"
                priority
                sizes="128px"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{roastery.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                {roastery.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{roastery.location}</span>
                  </div>
                )}
                {roastery.founded && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Founded: {roastery.founded}</span>
                  </div>
                )}
                {roastery.website && (
                  <a
                    href={roastery.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="inline-block w-2 h-6 bg-primary mr-2 rounded-sm"></span>
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed">{roastery.description}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="inline-block w-2 h-6 bg-primary mr-2 rounded-sm"></span>
                <Coffee className="mr-2 h-5 w-5" />
                Coffees from {roastery.name}
                <Badge className="ml-2" variant="outline">
                  {roasteryCoffees.length} {roasteryCoffees.length === 1 ? "coffee" : "coffees"}
                </Badge>
              </h2>

              {roasteryCoffees.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">No coffees available</p>
                    <p className="text-center text-muted-foreground">
                      This roaster doesn't have any coffees listed yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {roasteryCoffees.map((coffee) => (
                    <Card key={coffee.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1">{coffee.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => toggleWishlist(coffee.id)}
                          >
                            <Heart
                              className={`h-4 w-4 ${wishlist.includes(coffee.id) ? "fill-red-500 text-red-500" : ""}`}
                            />
                            <span className="sr-only">Add to wishlist</span>
                          </Button>
                        </div>
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
                                className="font-medium text-xs rounded-full px-2.5 py-0.5"
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
                        <div className="space-y-1 mt-3">
                          <div className="text-sm font-medium flex items-center">
                            <GiCoffeeBeans className="h-4 w-4 mr-1" />
                            Pricing
                          </div>
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
                        <div className="mt-3">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(coffee.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  } ${
                                    i === Math.floor(coffee.rating || 0) && (coffee.rating || 0) % 1 > 0
                                      ? "fill-yellow-400/50"
                                      : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-muted-foreground">{coffee.rating || 0}</span>
                            <span className="ml-1 text-xs text-muted-foreground">({coffee.ratingCount || 0})</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/coffee/${coffee.id}`} className="w-full">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Bean Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

