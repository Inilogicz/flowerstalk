import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import heroImage from "@/assets/hero-flowers.jpg";
import bouquetRoses from "@/assets/bouquet-roses.jpg";
import bouquetSunflowers from "@/assets/bouquet-sunflowers.jpg";
import bouquetMixed from "@/assets/bouquet-mixed.jpg";

const slides = [
  {
    id: 1,
    title: "Gifts and Flowers for Your Beloved",
    subtitle: "Express your love with our handcrafted bouquets",
    image: heroImage,
    cta: "Shop Now",
    link: "/shop",
  },
  {
    id: 2,
    title: "Romantic Rose Collection",
    subtitle: "Premium roses for every special occasion",
    image: bouquetRoses,
    cta: "View Collection",
    link: "/shop",
  },
  {
    id: 3,
    title: "Brighten Their Day",
    subtitle: "Sunshine sunflowers to spread joy",
    image: bouquetSunflowers,
    cta: "Explore More",
    link: "/shop",
  },
  {
    id: 4,
    title: "Custom Arrangements",
    subtitle: "Unique bouquets crafted just for you",
    image: bouquetMixed,
    cta: "Get Started",
    link: "/shop",
  },
];

export const FeaturedCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Autoplay
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image with Parallax Effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    transform: current === index ? "scale(1)" : "scale(1.1)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
                </div>

                {/* Content */}
                <div className="container relative h-full mx-auto px-4 flex items-center">
                  <div
                    className="max-w-2xl text-background"
                    style={{
                      animation: current === index ? "fade-in 0.8s ease-out" : "none",
                    }}
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-background/90">
                      {slide.subtitle}
                    </p>
                    <Link to={slide.link}>
                      <Button size="lg" variant="secondary" className="group">
                        {slide.cta}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Trust Badges */}
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-foreground/90 backdrop-blur">
                    <div className="container mx-auto px-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 text-background">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold">Same Day Delivery</div>
                            <div className="text-sm text-background/70">Within Lagos & Abuja</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold">Fresh Flowers</div>
                            <div className="text-sm text-background/70">Handpicked daily</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold">Secure Checkout</div>
                            <div className="text-sm text-background/70">100% secure payments</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur hover:bg-background/90 z-10"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur hover:bg-background/90 z-10"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Dots Indicator */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-8 bg-background" : "w-2 bg-background/50"
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
