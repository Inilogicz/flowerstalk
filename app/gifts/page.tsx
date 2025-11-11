"use client"

import { useState } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

export default function Shop() {
  const [filteredCategory, setFilteredCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const products = [
    {
      id: 1,
      name: "Red Roses Bouquet",
      category: "roses",
      price: 12500,
      originalPrice: 15000,
      image: "/placeholder.svg?key=3p7w8",
      rating: 4.9,
      reviews: 128,
      badge: "Best Seller",
    },
    {
      id: 2,
      name: "Sunflower Garden",
      category: "sunflowers",
      price: 11000,
      originalPrice: 13500,
      image: "/placeholder.svg?key=zhcbz",
      rating: 4.8,
      reviews: 95,
      badge: "New",
    },
    {
      id: 3,
      name: "Mixed Paradise",
      category: "mixed",
      price: 13800,
      originalPrice: 17500,
      image: "/placeholder.svg?key=2itum",
      rating: 4.9,
      reviews: 142,
      badge: "Sale",
    },
    {
      id: 4,
      name: "Orchid Elegance",
      category: "orchids",
      price: 15000,
      originalPrice: 20000,
      image: "/placeholder.svg?key=t68lw",
      rating: 5.0,
      reviews: 87,
      badge: "Premium",
    },
    {
      id: 5,
      name: "Peony Dream",
      category: "peonies",
      price: 13000,
      originalPrice: 16500,
      image: "/placeholder.svg?key=p9m2k",
      rating: 4.7,
      reviews: 64,
    },
    {
      id: 6,
      name: "Cherry Blossom Mix",
      category: "mixed",
      price: 11800,
      originalPrice: 14500,
      image: "/placeholder.svg?key=w5t8n",
      rating: 4.8,
      reviews: 112,
    },
    {
      id: 7,
      name: "Tulip Festival",
      category: "tulips",
      price: 10500,
      originalPrice: 13000,
      image: "/placeholder.svg?key=x2q5p",
      rating: 4.6,
      reviews: 78,
    },
    {
      id: 8,
      name: "Lily Luxury",
      category: "lilies",
      price: 16500,
      originalPrice: 22000,
      image: "/placeholder.svg?key=b3v7m",
      rating: 4.9,
      reviews: 95,
      badge: "Exclusive",
    },
  ]

  const categories = [
    { name: "All Products", value: "all" },
    { name: "Roses", value: "roses" },
    { name: "Sunflowers", value: "sunflowers" },
    { name: "Mixed Bouquets", value: "mixed" },
    { name: "Orchids", value: "orchids" },
    { name: "Tulips", value: "tulips" },
  ]

  const filteredProducts =
    filteredCategory === "all" ? products : products.filter((p) => p.category === filteredCategory)

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: String(product.id),
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
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">All Gifts</h1>
          <p className="text-muted-foreground">Gift your loved ones from this premium collections</p>
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

                  {product.originalPrice > product.price && (
                    <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-xs font-semibold text-rose-600">
                      Save ₦{(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(product.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <p className="text-lg font-bold text-foreground">₦{product.price.toLocaleString()}</p>
                    {product.originalPrice > product.price && (
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
        </div>
      </section>

      <Footer />
    </main>
  )
}
