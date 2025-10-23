import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import bouquetRoses from "@/assets/bouquet-roses.jpg";
import bouquetSunflowers from "@/assets/bouquet-sunflowers.jpg";
import bouquetMixed from "@/assets/bouquet-mixed.jpg";
import bouquetLilies from "@/assets/bouquet-lilies.jpg";

const allProducts = [
  { id: "1", name: "Romantic Rose Bouquet", price: 15000, image: bouquetRoses, category: "Roses" },
  { id: "2", name: "Sunshine Sunflowers", price: 12000, image: bouquetSunflowers, category: "Sunflowers" },
  { id: "3", name: "Spring Garden Mix", price: 18000, image: bouquetMixed, category: "Mixed Bouquets" },
  { id: "4", name: "Elegant White Lilies", price: 20000, image: bouquetLilies, category: "Lilies" },
  { id: "5", name: "Pink Rose Elegance", price: 16000, image: bouquetRoses, category: "Roses" },
  { id: "6", name: "Golden Sunburst", price: 13000, image: bouquetSunflowers, category: "Sunflowers" },
  { id: "7", name: "Wildflower Dreams", price: 17000, image: bouquetMixed, category: "Mixed Bouquets" },
  { id: "8", name: "Pure White Collection", price: 22000, image: bouquetLilies, category: "Lilies" },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Flowers");
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All Flowers", "Roses", "Sunflowers", "Lilies", "Mixed Bouquets"];

  // Filter products by category
  let filteredProducts = selectedCategory === "All Flowers"
    ? allProducts
    : allProducts.filter((p) => p.category === selectedCategory);

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Flower Collection</h1>
          <p className="text-lg text-muted-foreground">
            Browse our exquisite selection of fresh flowers and arrangements
          </p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
