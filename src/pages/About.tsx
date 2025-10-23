import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, Users, Award, Flower2 } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-light to-accent-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">About FlowerStalk</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nigeria's premier flower delivery service, spreading joy and beauty 
            through exquisite floral arrangements since 2001
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-6 text-center">About Flowerstalk </h2>
          <div className="prose prose-lg mx-auto text-muted-foreground space-y-4">
            <p>
             FlowerStalk has been the go-to place for every important and memorable event, with gorgeous blooms, lush flowers & gifts sets available for your dazzle.
            </p>
            <p>
             We take off the stress of deciding what beautiful package options to go for, and give you the best floral gifting with top-notch taste, charming designs, freshness guarantee for those who know what they want, and delightfully approachable blooms for those who don't.
            </p>
            <p>
             FlowerStalk was established in the year 2001 and is gradually becoming the #1 stop shop for gorgeous blooms, and how people shop for flowers. No one does it better than us we are known as the "Florist of Distinction".
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Flower2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-muted-foreground">
                Only the freshest, most beautiful flowers make it into our arrangements
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passion & Care</h3>
              <p className="text-muted-foreground">
                Every arrangement is crafted with love and attention to detail
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-muted-foreground">
                Your satisfaction and joy are at the heart of everything we do
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for perfection in every bouquet, every delivery, every time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Flower Varieties</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-secondary mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
