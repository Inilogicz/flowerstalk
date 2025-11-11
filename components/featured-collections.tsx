"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { ApiProduct, ApiResponse } from "@/app/shop/types"

type Product = Omit<ApiProduct, "_id" | "imageUrl"> & {
  id: string
  image: string
}

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://app.flowerstalk.org/v1/items/")
        if (!response.ok) {
          throw new Error("Failed to fetch collections")
        }
        const data: ApiResponse = await response.json()
        const mappedProducts: Product[] = data.data.map((p) => ({
          ...p,
          id: p._id,
          image: p.imageUrl,
        }))
        // Display up to 4 featured items
        setCollections(mappedProducts.slice(0, 4))
      } catch (error) {
        console.error("Error fetching collections:", error)
        // Don't show an error toast on the homepage for a cleaner look
      } finally {
        setLoading(false)
      }
    }
    fetchCollections()
  }, [])

  const handleAddToCart = (item: Product) => {
    addToCart({
      id: item.id, // This is now a string, fixing the type error
      name: item.name,
      price: item.price,
      image: item.image,
    })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <section className="w-full bg-secondary/50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Featured Collections</h2>
        <p className="text-muted-foreground mb-12">Discover our most loved and bestselling arrangements</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[350px]">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </div>
              ))
            : collections.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition group"
                >
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-secondary">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-2">{item.name}</h3>
                    {item.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400 text-sm">{"★".repeat(Math.floor(item.rating))}</div>
                        <span className="text-xs text-muted-foreground">({item.reviews})</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-foreground">₦{item.price.toLocaleString()}</p>
                      <Button size="sm" className="bg-rose-600 hover:bg-rose-700" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
