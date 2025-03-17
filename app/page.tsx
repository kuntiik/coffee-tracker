"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CoffeeList } from "@/components/coffee-list"
import { SearchFilters } from "@/components/search-filters"
import { Navbar } from "@/components/navbar"
import { type Coffee, coffees, initializeData } from "@/lib/data"

export default function Home() {
  const [filteredCoffees, setFilteredCoffees] = useState<Coffee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await initializeData()
        setFilteredCoffees(coffees)
      } catch (error) {
        console.error("Error initializing data:", error)
        setFilteredCoffees([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background pt-10 pb-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">Coffee Explorer</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover and track specialty coffee beans from roasters around the world. Find your next favorite brew and
              keep a record of your coffee journey.
            </p>
          </div>
        </section>

        <section className="container py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Browse Coffees</h2>
              <Link href="/add-coffee">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Coffee
                </Button>
              </Link>
            </div>
            <SearchFilters onFilterChange={setFilteredCoffees} isLoading={isLoading} />
            <CoffeeList coffees={filteredCoffees} isLoading={isLoading} />
          </div>
        </section>
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

