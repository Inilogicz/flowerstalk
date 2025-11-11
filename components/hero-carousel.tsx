"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const carouselItems = [
  {
    id: 1,
    title: "Red Roses",
    description: "Passionate elegance",
    image: "/red-roses-beautiful-bouquet.jpg",
    tag: "PREMIUM COLLECTION",
  },
  {
    id: 2,
    title: "Sunflowers",
    description: "Bright joy delivered",
    image: "/sunflowers-fresh-flowers.jpg",
    tag: "SEASONAL",
  },
  {
    id: 3,
    title: "Mixed Blooms",
    description: "Colorful perfection",
    image: "/mixed-flowers-bouquet-arrangement.jpg",
    tag: "BEST SELLER",
  },
]

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    setAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    setAutoPlay(false)
  }

  const currentItem = carouselItems[currentIndex]

  return (
    <section className="w-full bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-block text-rose-600 text-sm font-semibold tracking-wider mb-4">
              ✿ {currentItem.tag}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-pretty">
              Blooms That <span className="text-rose-600">Speak Beauty</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Handpicked floral arrangements crafted with precision and passion. From premium roses to exotic orchids,
              elevate every moment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-rose-600 mt-1">✿</span>
                <div>
                  <p className="font-semibold text-foreground">Fresh Daily</p>
                  <p className="text-sm text-muted-foreground">Blooming perfection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 mt-1">⭐</span>
                <div>
                  <p className="font-semibold text-foreground">Same Day Delivery</p>
                  <p className="text-sm text-muted-foreground">Express shipping</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">Shop Now →</Button>
              <Button variant="outline">Explore Collection</Button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-80 sm:h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-card shadow-lg">
              <Image
                src={currentItem.image || "/placeholder.svg"}
                alt={currentItem.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {/* Carousel Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h2 className="text-white text-2xl font-bold">{currentItem.title}</h2>
                <p className="text-white/80">{currentItem.description}</p>
              </div>

              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
              >
                <ChevronLeft className="w-6 h-6 text-black" />
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
              >
                <ChevronRight className="w-6 h-6 text-black" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setAutoPlay(false)
                    }}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentIndex ? "bg-rose-600 w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
