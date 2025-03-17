export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type CoffeeType = "beans" | "ground" | "pods" | "other"
export type CoffeeVariety = "arabica" | "robusta" | "blend"
export type RoastLevel = "light" | "medium" | "medium-dark" | "dark" | "other"

export interface Database {
  public: {
    Tables: {
      roasters: {
        Row: {
          id: string
          created_at: string | null
          name: string
          website_url: string | null
          image_url: string | null
          country: string | null
          city: string | null
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          name: string
          website_url?: string | null
          image_url?: string | null
          country?: string | null
          city?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          name?: string
          website_url?: string | null
          image_url?: string | null
          country?: string | null
          city?: string | null
          description?: string | null
        }
      }
      coffee: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          decaf: boolean | null
          farmer: string | null
          origin: string | null
          processing: string | null
          cupping_score: number | null
          flavor_profile: string[] | null
          roaster_id: string | null
          image_url: string | null
          altitude: string | null
          coffee_type: CoffeeType | null
          coffee_variety: CoffeeVariety | null
          roast_level: RoastLevel | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          decaf?: boolean | null
          farmer?: string | null
          origin?: string | null
          processing?: string | null
          cupping_score?: number | null
          flavor_profile?: string[] | null
          roaster_id?: string | null
          image_url?: string | null
          altitude?: string | null
          coffee_type?: CoffeeType | null
          coffee_variety?: CoffeeVariety | null
          roast_level?: RoastLevel | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          decaf?: boolean | null
          farmer?: string | null
          origin?: string | null
          processing?: string | null
          cupping_score?: number | null
          flavor_profile?: string[] | null
          roaster_id?: string | null
          image_url?: string | null
          altitude?: string | null
          coffee_type?: CoffeeType | null
          coffee_variety?: CoffeeVariety | null
          roast_level?: RoastLevel | null
        }
      }
      price_entry: {
        Row: {
          id: string
          created_at: string
          coffee_id: string | null
          weight: number | null
          price: number | null
          currency: string | null
          website_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          coffee_id?: string | null
          weight?: number | null
          price?: number | null
          currency?: string | null
          website_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          coffee_id?: string | null
          weight?: number | null
          price?: number | null
          currency?: string | null
          website_url?: string | null
        }
      }
      user_coffees: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          coffee_id: string | null
          user_note: string | null
          user_rating: number | null
          in_collection: boolean | null
          in_wishlist: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          coffee_id?: string | null
          user_note?: string | null
          user_rating?: number | null
          in_collection?: boolean | null
          in_wishlist?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          coffee_id?: string | null
          user_note?: string | null
          user_rating?: number | null
          in_collection?: boolean | null
          in_wishlist?: boolean | null
        }
      }
      coffee_purchase_history: {
        Row: {
          id: string
          created_at: string
          user_coffee_id: string | null
          weight: number | null
          price: number | null
          currency: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_coffee_id?: string | null
          weight?: number | null
          price?: number | null
          currency?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_coffee_id?: string | null
          weight?: number | null
          price?: number | null
          currency?: string | null
        }
      }
      user: {
        Row: {
          id: string
          created_at: string
          username: string
          password: string
          nickname: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          username: string
          password: string
          nickname?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          password?: string
          nickname?: string | null
        }
      }
    }
    Enums: {
      coffee_type: CoffeeType
      coffee_variety: CoffeeVariety
      roast_level: RoastLevel
    }
  }
}

