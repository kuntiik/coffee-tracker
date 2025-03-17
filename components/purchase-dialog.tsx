"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { updateUserCoffeeRelationship } from "@/lib/data"

interface PurchaseDialogProps {
  coffeeId: number
  onPurchaseComplete?: () => void
  variant?: "icon" | "default"
  className?: string
  buttonText?: string
}

export function PurchaseDialog({
  coffeeId,
  onPurchaseComplete,
  variant = "default",
  className = "",
  buttonText = "Add Purchase",
}: PurchaseDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("250g")
  const [price, setPrice] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const { user } = useAuth()
  const router = useRouter()

  const handleClick = () => {
    if (!user) {
      router.push("/login")
      return
    }
    setOpen(true)
  }

  const handleSubmit = () => {
    if (!user) return

    const purchaseData = {
      date,
      amount,
      price: Number.parseFloat(price) || 0,
    }

    // Update user-coffee relationship with new purchase
    updateUserCoffeeRelationship(user.id, coffeeId, {
      inCollection: true, // Ensure it's in collection
      purchaseHistory: "append", // Special value to append to existing history
      purchaseData,
    })

    setOpen(false)
    if (onPurchaseComplete) {
      onPurchaseComplete()
    }
  }

  if (variant === "icon") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${className}`} onClick={handleClick}>
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to collection</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Purchase</DialogTitle>
            <DialogDescription>Record your coffee purchase details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase-date" className="text-right">
                Date
              </Label>
              <Input
                id="purchase-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Select value={amount} onValueChange={setAmount}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="250g">250g</SelectItem>
                  <SelectItem value="500g">500g</SelectItem>
                  <SelectItem value="1kg">1kg</SelectItem>
                  <SelectItem value="2kg">2kg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Add to Collection
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
          <ShoppingCart className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Purchase</DialogTitle>
          <DialogDescription>Record your coffee purchase details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="purchase-date" className="text-right">
              Date
            </Label>
            <Input
              id="purchase-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Select value={amount} onValueChange={setAmount}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="250g">250g</SelectItem>
                <SelectItem value="500g">500g</SelectItem>
                <SelectItem value="1kg">1kg</SelectItem>
                <SelectItem value="2kg">2kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2">$</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add to Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

