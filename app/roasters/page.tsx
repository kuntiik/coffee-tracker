"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { CoffeeIcon, Search, MapPin, Globe, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { roasteries, initializeData } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function RoasteriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [localRoasteries, setLocalRoasteries] = useState(roasteries)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await initializeData()
        setLocalRoasteries(roasteries)
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredRoasteries = localRoasteries.filter(
    (roastery) =>
      roastery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roastery.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/10 to-background pt-10 pb-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Coffee Roasteries</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover specialty coffee roasters from around the world, each with their unique approach to sourcing and
              roasting exceptional coffee beans.
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="mb-8">
            <div className="relative max-w-md mx-auto md:mx-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search roasteries by name or location..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </CardHeader>
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
          ) : filteredRoasteries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <CoffeeIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">No roasteries found</p>
                <p className="text-center text-muted-foreground">Try adjusting your search terms</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Featured Roasteries */}
              {searchTerm === "" && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6 flex items-center">
                    <span className="inline-block w-2 h-6 bg-primary mr-2 rounded-sm"></span>
                    Featured Roasteries
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredRoasteries
                      .filter((roastery) => roastery.featured)
                      .map((roastery) => (
                        <RoasteryCard key={roastery.id} roastery={roastery} />
                      ))}
                  </div>
                </div>
              )}

              {/* All Roasteries */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <span className="inline-block w-2 h-6 bg-primary mr-2 rounded-sm"></span>
                  {searchTerm ? "Search Results" : "All Roasteries"}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredRoasteries.map((roastery) => (
                    <RoasteryCard key={roastery.id} roastery={roastery} />
                  ))}
                </div>
              </div>
            </>
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

function RoasteryCard({ roastery }) {
  return (
    <Card key={roastery.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
            <Image
              src={roastery.logo || "/placeholder.svg?height=100&width=100"}
              alt={roastery.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <CardTitle className="line-clamp-1">{roastery.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {roastery.location || "Unknown location"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="line-clamp-3 text-sm text-muted-foreground mb-3">{roastery.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {roastery.founded && (
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Founded: {roastery.founded}
            </span>
          )}
          {roastery.website && (
            <span className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              <a
                href={roastery.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Website
              </a>
            </span>
          )}
          <span className="ml-auto">
            <span className="font-medium">{roastery.coffeeIds?.length || 0}</span> coffees
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/roasteries/${encodeURIComponent(roastery.name)}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Roastery
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

