import type { Coffee, Roastery } from "../types"

// Default roasteries data
export const defaultRoasteries: Roastery[] = [
  {
    id: 1,
    name: "Coffeespot",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=400&width=1200",
    location: "Prague, Czech Republic",
    founded: 2012,
    description:
      "Coffeespot is a specialty coffee roaster based in Prague, focusing on direct trade relationships with farmers. They are known for their meticulous approach to roasting and commitment to sustainability.",
    website: "https://www.coffeespot.cz",
    coffeeIds: [1, 7, 8],
    featured: true,
  },
  {
    id: 2,
    name: "Doubleshot",
    logo: "/placeholder.svg?height=100&width=100",
    coverImage: "/placeholder.svg?height=400&width=1200",
    location: "Prague, Czech Republic",
    founded: 2010,
    description:
      "Doubleshot is one of the pioneers of specialty coffee in the Czech Republic. They focus on sourcing exceptional coffees directly from farmers and roasting them to highlight their unique characteristics.",
    website: "https://www.doubleshot.cz",
    coffeeIds: [2, 9],
    featured: true,
  },
  {
    id: 3,
    name: "Beansmith",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Brno, Czech Republic",
    founded: 2015,
    description:
      "Beansmith is a craft coffee roaster from Brno, focusing on small-batch roasting and seasonal offerings. They work closely with farmers to ensure quality and fair prices.",
    coffeeIds: [3],
    featured: false,
  },
  {
    id: 4,
    name: "Candycane Coffee",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Ostrava, Czech Republic",
    founded: 2017,
    description:
      "Candycane Coffee is a specialty coffee roaster known for their experimental processing methods and unique flavor profiles. They focus on creating memorable coffee experiences.",
    coffeeIds: [4],
    featured: true,
  },
  {
    id: 5,
    name: "Rebelbean",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Brno, Czech Republic",
    founded: 2013,
    description:
      "Rebelbean is a specialty coffee roaster with a focus on transparency and sustainability. They source their beans directly from farmers and are committed to ethical practices.",
    coffeeIds: [5],
    featured: false,
  },
  {
    id: 6,
    name: "Nordbeans",
    logo: "/placeholder.svg?height=100&width=100",
    location: "Liberec, Czech Republic",
    founded: 2016,
    description:
      "Nordbeans is a specialty coffee roaster from northern Czech Republic, focusing on Nordic-style light roasts that highlight the natural flavors of the coffee beans.",
    coffeeIds: [6],
    featured: false,
  },
]

// Default coffees data
export const defaultCoffees: Coffee[] = [
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    roasteryId: 1, // Coffeespot
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Washed",
    roastLevel: "Light",
    suitableFor: ["Filter"],
    flavorProfile: ["Citrus", "Floral", "Chocolate"],
    prices: [
      { amount: "250g", price: 14.99 },
      { amount: "500g", price: 27.99 },
      { amount: "1kg", price: 49.99 },
    ],
    description:
      "This Ethiopian Yirgacheffe is a bright and complex coffee with floral notes and a citrus acidity. The coffee is grown at high altitudes in the Yirgacheffe region of Ethiopia, known for producing some of the world's most distinctive coffees.",
    origin: "Yirgacheffe, Ethiopia",
    altitude: "1,800-2,200 meters",
    harvest: "October - December",
  },
  {
    id: 2,
    name: "Colombia La Claudina",
    roasteryId: 2, // Doubleshot
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Natural",
    roastLevel: "Medium",
    suitableFor: ["Omni"],
    flavorProfile: ["Caramel", "Nutty", "Chocolate"],
    prices: [
      { amount: "250g", price: 15.99 },
      { amount: "500g", price: 28.99 },
    ],
  },
  {
    id: 3,
    name: "Brazil Fazenda Rainha",
    roasteryId: 3, // Beansmith
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Natural",
    roastLevel: "Medium-Dark",
    suitableFor: ["Espresso"],
    flavorProfile: ["Nutty", "Chocolate", "Caramel"],
    prices: [
      { amount: "250g", price: 13.99 },
      { amount: "500g", price: 25.99 },
      { amount: "1kg", price: 47.99 },
    ],
  },
  {
    id: 4,
    name: "Kenya Kiambu AA",
    roasteryId: 4, // Candycane Coffee
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Washed",
    roastLevel: "Medium-Light",
    suitableFor: ["Filter"],
    flavorProfile: ["Blackcurrant", "Tomato", "Spice"],
    prices: [
      { amount: "250g", price: 16.99 },
      { amount: "500g", price: 31.99 },
    ],
  },
  {
    id: 5,
    name: "Guatemala Huehuetenango",
    roasteryId: 5, // Rebelbean
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Washed",
    roastLevel: "Medium",
    suitableFor: ["Omni"],
    flavorProfile: ["Chocolate", "Spice", "Caramel"],
    prices: [
      { amount: "250g", price: 14.49 },
      { amount: "500g", price: 26.99 },
      { amount: "1kg", price: 49.99 },
    ],
  },
  {
    id: 6,
    name: "Costa Rica Las Lajas",
    roasteryId: 6, // Nordbeans
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Honey",
    roastLevel: "Light",
    suitableFor: ["Filter"],
    flavorProfile: ["Honey", "Citrus", "Floral"],
    prices: [
      { amount: "250g", price: 15.49 },
      { amount: "500g", price: 28.99 },
    ],
  },
  {
    id: 7,
    name: "Rwanda Huye Mountain",
    roasteryId: 1, // Coffeespot
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Washed",
    roastLevel: "Medium",
    suitableFor: ["Omni"],
    flavorProfile: ["Berry", "Caramel", "Citrus"],
    prices: [
      { amount: "250g", price: 14.99 },
      { amount: "500g", price: 27.99 },
    ],
  },
  {
    id: 8,
    name: "Panama Geisha",
    roasteryId: 1, // Coffeespot
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Washed",
    roastLevel: "Light",
    suitableFor: ["Filter"],
    flavorProfile: ["Floral", "Jasmine", "Tropical"],
    prices: [
      { amount: "250g", price: 29.99 },
      { amount: "100g", price: 14.99 },
    ],
  },
  {
    id: 9,
    name: "El Salvador Kilimanjaro",
    roasteryId: 2, // Doubleshot
    image: "/placeholder.svg?height=200&width=200",
    beanType: "Arabica",
    processing: "Natural",
    roastLevel: "Medium",
    suitableFor: ["Espresso"],
    flavorProfile: ["Chocolate", "Cherry", "Almond"],
    prices: [
      { amount: "250g", price: 15.99 },
      { amount: "500g", price: 29.99 },
    ],
  },
]

