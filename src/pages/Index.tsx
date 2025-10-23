import { Navbar } from "@/components/Navbar";
import  ProcessSteps  from "@/components/ProcessSteps";
// import FlowerCarousel from "@/components/flower-carousel";
import { Hero } from "@/components/Hero";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bouquetRoses from "@/assets/bouquet-roses.jpg";
import bouquetSunflowers from "@/assets/bouquet-sunflowers.jpg";
import bouquetMixed from "@/assets/bouquet-mixed.jpg";
import bouquetLilies from "@/assets/bouquet-lilies.jpg";

const featuredProducts = [
  {
    id: "1",
    name: "Romantic Rose Bouquet",
    price: 15000,
    image: bouquetRoses,
    category: "Roses"
  },
  {
    id: "2",
    name: "Sunshine Sunflowers",
    price: 12000,
    image: bouquetSunflowers,
    category: "Sunflowers"
  },
  {
    id: "3",
    name: "Spring Garden Mix",
    price: 18000,
    image: bouquetMixed,
    category: "Mixed Bouquets"
  },
  {
    id: "4",
    name: "Elegant White Lilies",
    price: 20000,
    image: bouquetLilies,
    category: "Lilies"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
       <ProcessSteps />
      
      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Featured Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of stunning flower arrangements, 
            crafted with love and care to brighten any occasion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/shop">
            <Button size="lg" variant="outline" className="group">
              View All Flowers
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Life is the flower for which love is the honey
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The act of sending flowers conveys your heart's deepest emotions when you are 
              lost for words. A bouquet of simple gorgeous roses will make someone smile so 
              readily. Start spreading your joy to loved ones now!
            </p>
            <Link to="/about">
              <Button size="lg">Learn More About Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Shop by Occasion</h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect flowers for every special moment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Birthday", color: "from-primary to-primary-light" },
            { title: "Anniversary", color: "from-accent to-accent-light" },
            { title: "Sympathy", color: "from-secondary to-secondary-light" }
          ].map((occasion) => (
            <Link key={occasion.title} to="/shop">
              <div className={`relative h-64 rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-br ${occasion.color}`}>
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-serif font-bold text-background">
                    {occasion.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
