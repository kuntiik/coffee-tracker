import { createClient } from "@supabase/supabase-js"
import type { Coffee, Roastery } from "../types"

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to fetch roasters from Supabase
export async function fetchRoastersFromSupabase(): Promise<Roastery[]> {
  try {
    const { data, error } = await supabase.from("roasters").select("*")

    if (error) {
      console.error("Error fetching roasters from Supabase:", error)
      return []
    }

    console.log("Fetched roasters data:", data)

    // Transform data to match Roastery interface
    return data.map((roaster) => ({
      id: roaster.id,
      name: roaster.name || "Unknown Roaster",
      logo: roaster.image_url || "/placeholder.svg?height=100&width=100",
      location: roaster.location || "Unknown Location",
      founded: roaster.founded || undefined,
      description: roaster.description || "No description available",
      website: roaster.website || undefined,
      coverImage: roaster.cover_image || undefined,
      coffeeIds: [], // Will be populated later
      featured: roaster.featured || false,
      imageUrl: roaster.image_url || undefined,
      kofio_url: roaster.kofio_url || undefined,
      city: roaster.city || undefined,
      about: roaster.about || undefined,
      country: roaster.country || undefined,
      website_url: roaster.website_url || undefined,
    }))
  } catch (error) {
    console.error("Error in fetchRoastersFromSupabase:", error)
    return []
  }
}

// Function to fetch coffees from Supabase
export async function fetchCoffeesFromSupabase(): Promise<Coffee[]> {
  try {
    const { data, error } = await supabase.from("coffees").select("*")

    if (error) {
      console.error("Error fetching coffees from Supabase:", error)
      return []
    }

    // Transform data to match Coffee interface
    return data.map((coffee) => ({
      id: coffee.id,
      name: coffee.name || "Unknown Coffee",
      roasteryId: coffee.roastery_id || 0,
      image: coffee.image || "/placeholder.svg?height=200&width=200",
      beanType: coffee.bean_type || "Unknown",
      processing: coffee.processing || "Unknown",
      roastLevel: coffee.roast_level || "Unknown",
      suitableFor: coffee.suitable_for || ["Unknown"],
      flavorProfile: coffee.flavor_profile || ["Unknown"],
      prices: coffee.prices || [],
      description: coffee.description || undefined,
      origin: coffee.origin || undefined,
      altitude: coffee.altitude || undefined,
      harvest: coffee.harvest || undefined,
      variety: coffee.variety || undefined,
      farmer: coffee.farmer || undefined,
      cupping_score: coffee.cupping_score || null,
      decaf: coffee.decaf || false,
    }))
  } catch (error) {
    console.error("Error in fetchCoffeesFromSupabase:", error)
    return []
  }
}

// Function to fetch coffees by roastery ID from Supabase
export async function fetchCoffeesByRoasteryId(roasteryId: string | number): Promise<Coffee[]> {
  try {
    const { data, error } = await supabase.from("coffees").select("*").eq("roastery_id", roasteryId)

    if (error) {
      console.error(`Error fetching coffees for roastery ${roasteryId} from Supabase:`, error)
      return []
    }

    // Transform data to match Coffee interface
    return data.map((coffee) => ({
      id: coffee.id,
      name: coffee.name || "Unknown Coffee",
      roasteryId: coffee.roastery_id || 0,
      image: coffee.image || "/placeholder.svg?height=200&width=200",
      beanType: coffee.bean_type || "Unknown",
      processing: coffee.processing || "Unknown",
      roastLevel: coffee.roast_level || "Unknown",
      suitableFor: coffee.suitable_for || ["Unknown"],
      flavorProfile: coffee.flavor_profile || ["Unknown"],
      prices: coffee.prices || [],
      description: coffee.description || undefined,
      origin: coffee.origin || undefined,
      altitude: coffee.altitude || undefined,
      harvest: coffee.harvest || undefined,
      variety: coffee.variety || undefined,
      farmer: coffee.farmer || undefined,
      cupping_score: coffee.cupping_score || null,
      decaf: coffee.decaf || false,
    }))
  } catch (error) {
    console.error(`Error in fetchCoffeesByRoasteryId for roastery ${roasteryId}:`, error)
    return []
  }
}

