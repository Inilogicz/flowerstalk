"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { ApiProduct, ApiResponse } from "./types"

type Product = Omit<ApiProduct, "_id" | "imageUrl"> & {
  id: string
  image: string
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredCategory, setFilteredCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("https://app.flowerstalk.org/v1/items/")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data: ApiResponse = await response.json()
        const mappedProducts: Product[] = data.data.map((p) => ({
          ...p,
          id: p._id,
          image: p.imageUrl,
        }))
        setProducts(mappedProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [
    { name: "All Products", value: "all" },
    { name: "Flowers", value: "Flowers" },
  ]

  const filteredProducts =
    filteredCategory === "all" ? products : products.filter((p) => p.category === filteredCategory)

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">Our Shop</h1>
          <p className="text-muted-foreground">Explore our premium collection of fresh, handpicked flowers</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full bg-background border-b border-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilteredCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    filteredCategory === cat.value
                      ? "bg-rose-600 text-white"
                      : "bg-secondary text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border text-sm bg-background"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {loading && <p>Loading products...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && products.length === 0 && <p>No products found.</p>}
          {!loading && !error && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition group h-full flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-secondary">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-300"
                  />

                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.badge}
                    </div>
                  )}

                  <button className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-rose-50 transition">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </button>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-semibold text-rose-600">
                      Save ₦{(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>

                  {product.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.floor(product.rating!) ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({product.reviews})</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <p className="text-lg font-bold text-foreground">₦{product.price.toLocaleString()}</p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-sm line-through text-muted-foreground">
                        ₦{product.originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
