"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PlusCircle, Trash2, Coffee, ArrowLeft } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/auth-context"
import { AddRoasterDialog } from "@/components/add-roaster-dialog"
import { roasteries } from "@/lib/data"
import { beanTypes, processingMethods, roastLevels, brewingMethods, flavorNotes } from "@/lib/constants/filters"
import type { Database } from "@/lib/database.types"

type Roaster = Database["public"]["Tables"]["roasters"]["Row"]
type Price = {
  amount: string
  price: string
  currency: string
}

export default function AddCoffeePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRoastery, setSelectedRoastery] = useState("")
  const [searchRoastery, setSearchRoastery] = useState("")
  const [showRoasteryDropdown, setShowRoasteryDropdown] = useState(false)
  const [localRoasteries, setLocalRoasteries] = useState(roasteries)
  const [prices, setPrices] = useState([{ amount: "250g", price: "", currency: "USD" }])
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedBrewMethods, setSelectedBrewMethods] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    roasteryId: "",
    beanType: "",
    processing: "",
    roastLevel: "",
    origin: "",
    altitude: "",
    harvest: "",
    description: "",
    image: "",
  })
  const [isLoadingRoasters, setIsLoadingRoasters] = useState(true)
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()
  const [roasters, setRoasters] = useState<Roaster[]>([])
  const [showNewRoasteryDialog, setShowNewRoasteryDialog] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    const fetchRoasters = async () => {
      try {
        setIsLoadingRoasters(true)
        const { data, error } = await supabase.from("roasters").select("*").order("name")

        if (error) {
          throw error
        }

        setRoasters(data || [])
      } catch (error) {
        console.error("Error fetching roasters:", error)
        toast({
          title: "Error",
          description: "Failed to load roasters. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingRoasters(false)
      }
    }

    fetchRoasters()
  }, [supabase, toast])

  const filteredRoasteries = searchRoastery
    ? localRoasteries.filter((r) => r.name.toLowerCase().includes(searchRoastery.toLowerCase()))
    : localRoasteries

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoasterySelect = (roasteryId: string, roasteryName: string) => {
    setFormData((prev) => ({ ...prev, roasteryId }))
    setSelectedRoastery(roasteryName)
    setShowRoasteryDropdown(false)
  }

  const handleAddPrice = () => {
    setPrices([...prices, { amount: "", price: "", currency: "USD" }])
  }

  const handleRemovePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index))
  }

  const handlePriceChange = (index: number, field: "amount" | "price" | "currency", value: string) => {
    const newPrices = [...prices]
    newPrices[index][field] = value
    setPrices(newPrices)
  }

  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) => (prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]))
  }

  const handleBrewMethodToggle = (method: string) => {
    setSelectedBrewMethods((prev) => (prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (
        !formData.name ||
        !formData.roasteryId ||
        !formData.beanType ||
        !formData.processing ||
        !formData.roastLevel
      ) {
        alert("Please fill in all required fields")
        setIsSubmitting(false)
        return
      }

      if (prices.some((p) => !p.amount || !p.price)) {
        alert("Please fill in all price information")
        setIsSubmitting(false)
        return
      }

      if (selectedBrewMethods.length === 0) {
        alert("Please select at least one brewing method")
        setIsSubmitting(false)
        return
      }

      if (selectedFlavors.length === 0) {
        alert("Please select at least one flavor note")
        setIsSubmitting(false)
        return
      }

      // Prepare data for submission
      const coffeeData = {
        ...formData,
        prices,
        flavorProfile: selectedFlavors,
        suitableFor: selectedBrewMethods,
        // Add any other fields needed
      }

      console.log("Submitting coffee data:", coffeeData)

      // Here you would normally send the data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to home page or coffee detail page
      router.push("/")
    } catch (error) {
      console.error("Error submitting coffee:", error)
      alert("Failed to add coffee. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRoasteryAdded = (newRoastery: any) => {
    setLocalRoasteries((prev) => [...prev, newRoastery])
    handleRoasterySelect(newRoastery.id, newRoastery.name)
  }

  const handleAddRoaster = async (roasterData: { name: string; location?: string; website?: string }) => {
    try {
      const { data, error } = await supabase
        .from("roasters")
        .insert({
          name: roasterData.name,
          location: roasterData.location || null,
          website: roasterData.website || null,
        })
        .select()

      if (error) {
        throw error
      }

      // Refresh roasters list
      const { data: updatedRoasters, error: fetchError } = await supabase.from("roasters").select("*").order("name")

      if (fetchError) {
        throw fetchError
      }

      setRoasters(updatedRoasters || [])

      // Set the newly added roaster as selected
      if (data && data[0]) {
        // setRoastery(data[0].name)
        // setSelectedRoasteryId(data[0].id)
      }

      setShowNewRoasteryDialog(false)

      toast({
        title: "Success",
        description: "Roaster added successfully!",
      })
    } catch (error) {
      console.error("Error adding roaster:", error)
      toast({
        title: "Error",
        description: "Failed to add roaster. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>

          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Coffee className="h-5 w-5" />
                  <CardTitle>Add New Coffee</CardTitle>
                </div>
                <CardDescription>Add a new coffee to your collection or wishlist</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">
                          Coffee Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. Ethiopia Yirgacheffe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="roastery">
                          Roastery <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="roastery"
                            placeholder="Search for a roastery..."
                            value={searchRoastery}
                            onChange={(e) => {
                              setSearchRoastery(e.target.value)
                              setShowRoasteryDropdown(true)
                            }}
                            onFocus={() => setShowRoasteryDropdown(true)}
                            className={selectedRoastery ? "bg-muted" : ""}
                          />
                          {selectedRoastery && (
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                              <span>{selectedRoastery}</span>
                            </div>
                          )}
                          {showRoasteryDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                              <div className="p-2">
                                <AddRoasterDialog onRoasteryAdded={handleRoasteryAdded} />
                              </div>
                              <div className="py-1">
                                {filteredRoasteries.length > 0 ? (
                                  filteredRoasteries.map((roastery) => (
                                    <div
                                      key={roastery.id}
                                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                                      onClick={() => handleRoasterySelect(roastery.id, roastery.name)}
                                    >
                                      {roastery.name}
                                    </div>
                                  ))
                                ) : (
                                  <div className="px-4 py-2 text-muted-foreground">No roasteries found</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          name="image"
                          placeholder="https://example.com/coffee-image.jpg"
                          value={formData.image}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe the coffee..."
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Coffee Details</h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="beanType">
                          Bean Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="beanType"
                          value={formData.beanType}
                          onValueChange={(value) => handleSelectChange("beanType", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bean type" />
                          </SelectTrigger>
                          <SelectContent>
                            {beanTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="processing">
                          Processing Method <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="processing"
                          value={formData.processing}
                          onValueChange={(value) => handleSelectChange("processing", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select processing method" />
                          </SelectTrigger>
                          <SelectContent>
                            {processingMethods.map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="roastLevel">
                          Roast Level <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          name="roastLevel"
                          value={formData.roastLevel}
                          onValueChange={(value) => handleSelectChange("roastLevel", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select roast level" />
                          </SelectTrigger>
                          <SelectContent>
                            {roastLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="origin">Origin</Label>
                        <Input
                          id="origin"
                          name="origin"
                          placeholder="e.g. Ethiopia, Yirgacheffe"
                          value={formData.origin}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="altitude">Altitude</Label>
                        <Input
                          id="altitude"
                          name="altitude"
                          placeholder="e.g. 1800-2200m"
                          value={formData.altitude}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="harvest">Harvest Period</Label>
                        <Input
                          id="harvest"
                          name="harvest"
                          placeholder="e.g. November-January"
                          value={formData.harvest}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pricing</h3>
                    <div className="space-y-4">
                      {prices.map((price, index) => (
                        <div key={index} className="flex items-end gap-2">
                          <div className="grid gap-2 flex-1">
                            <Label htmlFor={`amount-${index}`}>Amount</Label>
                            <Input
                              id={`amount-${index}`}
                              placeholder="e.g. 250g"
                              value={price.amount}
                              onChange={(e) => handlePriceChange(index, "amount", e.target.value)}
                              required
                            />
                          </div>
                          <div className="grid gap-2 flex-1">
                            <Label htmlFor={`price-${index}`}>Price</Label>
                            <div className="flex">
                              <Input
                                id={`price-${index}`}
                                placeholder="e.g. 12.99"
                                value={price.price}
                                onChange={(e) => handlePriceChange(index, "price", e.target.value)}
                                required
                                className="rounded-r-none"
                              />
                              <Select
                                value={price.currency}
                                onValueChange={(value) => handlePriceChange(index, "currency", value)}
                              >
                                <SelectTrigger className="w-24 rounded-l-none border-l-0">
                                  <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="CZK">CZK</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {prices.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => handleRemovePrice(index)}
                              className="mb-0.5"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove price</span>
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={handleAddPrice}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Another Price
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Flavor Profile & Brewing</h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="block mb-2">
                          Flavor Notes <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {flavorNotes.map((flavor) => (
                            <div key={flavor} className="flex items-center space-x-2">
                              <Checkbox
                                id={`flavor-${flavor}`}
                                checked={selectedFlavors.includes(flavor)}
                                onCheckedChange={() => handleFlavorToggle(flavor)}
                              />
                              <Label htmlFor={`flavor-${flavor}`} className="text-sm font-normal">
                                {flavor}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="block mb-2">
                          Suitable For <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {brewingMethods.map((method) => (
                            <div key={method} className="flex items-center space-x-2">
                              <Checkbox
                                id={`method-${method}`}
                                checked={selectedBrewMethods.includes(method)}
                                onCheckedChange={() => handleBrewMethodToggle(method)}
                              />
                              <Label htmlFor={`method-${method}`} className="text-sm font-normal">
                                {method}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Link href="/">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding..." : "Add Coffee"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AddRoasterDialog
        open={showNewRoasteryDialog}
        onOpenChange={setShowNewRoasteryDialog}
        onAddRoaster={handleAddRoaster}
      />
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

