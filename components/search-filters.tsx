"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { type Coffee, coffees, roasteries, getRoasteryById } from "@/lib/data"
import { processingTypes, roastLevels, brewingMethods, flavorProfiles } from "@/lib/constants/filters"

interface SearchFiltersProps {
  onFilterChange: (filteredCoffees: Coffee[]) => void
  isLoading?: boolean
}

export function SearchFilters({ onFilterChange, isLoading = false }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProcessing, setSelectedProcessing] = useState<string[]>([])
  const [selectedRoastLevels, setSelectedRoastLevels] = useState<string[]>([])
  const [selectedBrewingMethods, setSelectedBrewingMethods] = useState<string[]>([])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedRoasteries, setSelectedRoasteries] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 60])
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [flavorSearchTerm, setFlavorSearchTerm] = useState("")
  const [openFlavorSelector, setOpenFlavorSelector] = useState(false)

  const roasteryNames = roasteries.map((r) => r.name)

  // Apply filters and search to coffee data
  useEffect(() => {
    if (isLoading) return

    const filteredCoffees = coffees.filter((coffee) => {
      const roastery = getRoasteryById(coffee.roasteryId)
      const roasteryName = roastery ? roastery.name : ""

      // Search term filter
      const searchMatch =
        searchTerm.trim() === "" ||
        coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roasteryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coffee.flavorProfile.some((flavor) => flavor.toLowerCase().includes(searchTerm.toLowerCase()))

      // Processing filter
      const processingMatch = selectedProcessing.length === 0 || selectedProcessing.includes(coffee.processing)

      // Roast level filter
      const roastLevelMatch = selectedRoastLevels.length === 0 || selectedRoastLevels.includes(coffee.roastLevel)

      // Brewing method filter
      const brewingMethodMatch =
        selectedBrewingMethods.length === 0 ||
        coffee.suitableFor.some((method) => selectedBrewingMethods.includes(method))

      // Flavor profile filter
      const flavorMatch =
        selectedFlavors.length === 0 || selectedFlavors.some((flavor) => coffee.flavorProfile.includes(flavor))

      // Roastery filter
      const roasteryMatch = selectedRoasteries.length === 0 || (roastery && selectedRoasteries.includes(roastery.name))

      // Price filter - check if any of the coffee's prices fall within the range
      const priceMatch =
        priceRange[0] === 0 ||
        coffee.prices.some((price) => price.price >= priceRange[0] && price.price <= priceRange[1])

      return (
        searchMatch &&
        processingMatch &&
        roastLevelMatch &&
        brewingMethodMatch &&
        flavorMatch &&
        roasteryMatch &&
        priceMatch
      )
    })

    onFilterChange(filteredCoffees)

    // Set filters applied state
    setFiltersApplied(
      selectedProcessing.length > 0 ||
        selectedRoastLevels.length > 0 ||
        selectedBrewingMethods.length > 0 ||
        selectedFlavors.length > 0 ||
        selectedRoasteries.length > 0 ||
        priceRange[0] > 0 ||
        searchTerm.trim() !== "",
    )
  }, [
    searchTerm,
    selectedProcessing,
    selectedRoastLevels,
    selectedBrewingMethods,
    selectedFlavors,
    selectedRoasteries,
    priceRange,
    onFilterChange,
    isLoading,
  ])

  const toggleProcessing = (value: string) => {
    setSelectedProcessing((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const toggleRoastLevel = (value: string) => {
    setSelectedRoastLevels((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const toggleBrewingMethod = (value: string) => {
    setSelectedBrewingMethods((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const toggleFlavor = (value: string) => {
    setSelectedFlavors((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
    setOpenFlavorSelector(false)
  }

  const toggleRoastery = (value: string) => {
    setSelectedRoasteries((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedProcessing([])
    setSelectedRoastLevels([])
    setSelectedBrewingMethods([])
    setSelectedFlavors([])
    setSelectedRoasteries([])
    setPriceRange([0, 60])
  }

  // Filter flavor profiles based on search term
  const filteredFlavorProfiles = flavorProfiles.filter((flavor) =>
    flavor.toLowerCase().includes(flavorSearchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search coffee beans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {filtersApplied && (
                <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Filter Coffee Beans</SheetTitle>
              <SheetDescription>Refine your coffee search with these filters.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="price-range" className="text-base">
                  Price Range (per 250g)
                </Label>
                <div className="flex items-center justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <Slider
                  id="price-range"
                  defaultValue={[0, 60]}
                  max={60}
                  step={1}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Processing Method</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {processingTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`processing-${type}`}
                        checked={selectedProcessing.includes(type)}
                        onCheckedChange={() => toggleProcessing(type)}
                      />
                      <Label htmlFor={`processing-${type}`} className="text-sm font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Roast Level</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {roastLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`roast-${level}`}
                        checked={selectedRoastLevels.includes(level)}
                        onCheckedChange={() => toggleRoastLevel(level)}
                      />
                      <Label htmlFor={`roast-${level}`} className="text-sm font-normal">
                        {level}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Brewing Method</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {brewingMethods.map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brewing-${method}`}
                        checked={selectedBrewingMethods.includes(method)}
                        onCheckedChange={() => toggleBrewingMethod(method)}
                      />
                      <Label htmlFor={`brewing-${method}`} className="text-sm font-normal">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Flavor Profile</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFlavors.map((flavor) => (
                    <Badge key={flavor} className="flex items-center gap-1">
                      {flavor}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFlavor(flavor)} />
                    </Badge>
                  ))}
                </div>
                <Popover open={openFlavorSelector} onOpenChange={setOpenFlavorSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedFlavors.length > 0 ? `${selectedFlavors.length} selected` : "Select flavors"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search flavors..."
                        value={flavorSearchTerm}
                        onValueChange={setFlavorSearchTerm}
                      />
                      <CommandList>
                        <CommandEmpty>No flavors found.</CommandEmpty>
                        <CommandGroup>
                          {filteredFlavorProfiles.map((flavor) => (
                            <CommandItem
                              key={flavor}
                              onSelect={() => toggleFlavor(flavor)}
                              className="flex items-center"
                            >
                              <Checkbox
                                checked={selectedFlavors.includes(flavor)}
                                className="mr-2"
                                onCheckedChange={() => {}}
                              />
                              {flavor}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Roastery</Label>
                <div className="grid gap-2">
                  {roasteryNames.map((roastery) => (
                    <div key={roastery} className="flex items-center space-x-2">
                      <Checkbox
                        id={`roastery-${roastery}`}
                        checked={selectedRoasteries.includes(roastery)}
                        onCheckedChange={() => toggleRoastery(roastery)}
                      />
                      <Label htmlFor={`roastery-${roastery}`} className="text-sm font-normal">
                        {roastery}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <SheetClose asChild>
                <Button>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by</SelectLabel>
              <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
              <SelectItem value="rating-asc">Rating: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filtersApplied && (
        <div className="flex flex-wrap gap-2">
          {searchTerm.trim() !== "" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
          {selectedProcessing.map((type) => (
            <Badge key={type} variant="secondary" className="flex items-center gap-1">
              {type}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleProcessing(type)} />
            </Badge>
          ))}
          {selectedRoastLevels.map((level) => (
            <Badge key={level} variant="secondary" className="flex items-center gap-1">
              {level}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleRoastLevel(level)} />
            </Badge>
          ))}
          {selectedBrewingMethods.map((method) => (
            <Badge key={method} variant="secondary" className="flex items-center gap-1">
              {method}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrewingMethod(method)} />
            </Badge>
          ))}
          {selectedFlavors.map((flavor) => (
            <Badge key={flavor} variant="secondary" className="flex items-center gap-1">
              {flavor}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFlavor(flavor)} />
            </Badge>
          ))}
          {selectedRoasteries.map((roastery) => (
            <Badge key={roastery} variant="secondary" className="flex items-center gap-1">
              {roastery}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleRoastery(roastery)} />
            </Badge>
          ))}
          {priceRange[0] > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 60])} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}

