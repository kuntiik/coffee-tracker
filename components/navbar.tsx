"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Coffee, User, LogOut, Home, Package, Heart, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Roasters", href: "/roasters" },
    { name: "Add Coffee", href: "/add-coffee" },
  ]

  const userNavItems = user
    ? [
        { name: "Dashboard", href: "/dashboard", icon: <User className="mr-2 h-4 w-4" /> },
        { name: "Wishlist", href: "/wishlist", icon: <Heart className="mr-2 h-4 w-4" /> },
      ]
    : [{ name: "Login", href: "/login", icon: <User className="mr-2 h-4 w-4" /> }]

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Coffee className="h-6 w-6" />
            <span className="font-bold">Bean Tracker</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {user.name || "Account"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <Coffee className="h-6 w-6" />
                  <span className="font-bold">Bean Tracker</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/roasters"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Roasters
                  </Link>
                  <Link
                    href="/add-coffee"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Coffee
                  </Link>
                  {userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                  {user && (
                    <button
                      onClick={logout}
                      className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

