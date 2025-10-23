import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Truck, Shield } from "lucide-react";
import { useParams } from "react-router-dom";
import bouquetRoses from "@/assets/bouquet-roses.jpg";

const ProductDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img 
                src={bouquetRoses} 
                alt="Romantic Rose Bouquet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">Roses</Badge>
              <h1 className="text-4xl font-serif font-bold mb-4">Romantic Rose Bouquet</h1>
              <div className="text-3xl font-bold text-primary mb-4">₦15,000</div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A stunning arrangement of fresh pink roses complemented with baby's breath and 
                eucalyptus leaves. Wrapped elegantly in premium white paper with a satin ribbon. 
                Perfect for expressing love and appreciation.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 border-y border-border py-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Truck className="h-5 w-5 text-primary" />
                <span>Same-day delivery available in Lagos & Abuja</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <span>100% freshness guarantee</span>
              </div>
            </div>

            {/* Order Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Truck className="h-5 w-5" />
                    <span>Home Delivery</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Store Pickup</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-muted rounded-lg p-6 space-y-3">
              <h3 className="font-semibold">Product Details</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Contains 12-15 fresh roses</li>
                <li>• Hand-arranged by expert florists</li>
                <li>• Includes care instructions</li>
                <li>• Vase not included (available separately)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
