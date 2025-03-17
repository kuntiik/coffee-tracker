"use client"

import { useState } from "react"
import { Search, Plus, Minus, ThermometerSnowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { coffees, addCoffeeToFreezer } from "@/lib/data"

interface FreezerDialogProps {
  coffeeId?: number
  onComplete?: () => void
  variant?: "icon" | "default"
  className?: string
  buttonText?: string
}

export function FreezerDialog({
  coffeeId,
  onComplete,
  variant = "default",
  className = "",
  buttonText = "Add to Freezer",
}: FreezerDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCoffeeId, setSelectedCoffeeId] = useState<number | null>(coffeeId || null)
  const [amount, setAmount] = useState("100")
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      router.push("/login")
      return
    }
    setOpen(true)
    if (coffeeId) {
      setSelectedCoffeeId(coffeeId)
    }
  }

  const handleSubmit = () => {
    if (!user || !selectedCoffeeId) return

    const doseWeight = Number.parseFloat(amount)
    if (isNaN(doseWeight) || doseWeight <= 0) return

    const today = new Date().toISOString().split("T")[0]

    // Add multiple doses based on quantity
    for (let i = 0; i < quantity; i++) {
      addCoffeeToFreezer(user.id, selectedCoffeeId, {
        amount: `${amount}g`,
        dateAdded: today,
      })
    }

    setOpen(false)
    if (onComplete) {
      onComplete()
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const filteredCoffees = coffees.filter(
    (coffee) =>
      coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.flavorProfile.some((flavor) => flavor.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (variant === "icon") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${className}`} onClick={handleClick}>
            <ThermometerSnowflake className="h-4 w-4" />
            <span className="sr-only">Add to freezer</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Freezer</DialogTitle>
            <DialogDescription>Store your coffee in the freezer to preserve freshness.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!coffeeId && (
              <div className="grid gap-2">
                <Label>Select Coffee</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search coffees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="max-h-40 overflow-y-auto border rounded-md">
                  {filteredCoffees.map((coffee) => (
                    <div
                      key={coffee.id}
                      className={`p-2 cursor-pointer hover:bg-muted ${
                        selectedCoffeeId === coffee.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedCoffeeId(coffee.id)}
                    >
                      {coffee.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (g)
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <div className="col-span-3 flex items-center">
                <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="mx-2 text-center"
                />
                <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit} disabled={!selectedCoffeeId}>
              Add to Freezer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className} onClick={handleClick}>
          <ThermometerSnowflake className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Freezer</DialogTitle>
          <DialogDescription>Store your coffee in the freezer to preserve freshness.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!coffeeId && (
            <div className="grid gap-2">
              <Label>Select Coffee</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search coffees..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-md">
                {filteredCoffees.map((coffee) => (
                  <div
                    key={coffee.id}
                    className={`p-2 cursor-pointer hover:bg-muted ${selectedCoffeeId === coffee.id ? "bg-muted" : ""}`}
                    onClick={() => setSelectedCoffeeId(coffee.id)}
                  >
                    {coffee.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (g)
            </Label>
            <Input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <div className="col-span-3 flex items-center">
              <Button variant="outline" size="icon" onClick={decrementQuantity} className="h-8 w-8">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="mx-2 text-center"
              />
              <Button variant="outline" size="icon" onClick={incrementQuantity} className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedCoffeeId}>
            Add to Freezer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

