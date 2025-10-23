"use client"
// import import React from "react"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import bouquetRedRoses from "@/assets/beautiful-red-roses-bouquet.jpeg"
import bouquetSunflowers from "@/assets/bouquet-sunflowers.jpg"
import bouquetMixed from "@/assets/bouquet-mixed.jpg"
import elegantPurpleOrchids from "@/assets/elegant-purple-orchids.jpeg"

const flowerImages: { id: number; title: string; image: string }[] = [
  {
    id: 1,
    title: "Red Roses",
    image: bouquetRedRoses,
  },
  {
    id: 2,
    title: "Sunflowers",
    image: bouquetSunflowers,
  },
  {
    id: 3,
    title: "Tulips Mix",
    image: bouquetMixed,
  },
  {
    id: 4,
    title: "Orchids",
    image: elegantPurpleOrchids,
  },
]

export const FlowerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flowerImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + flowerImages.length) % flowerImages.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flowerImages.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  return (
    <div
      className="relative w-full max-w-2xl mx-auto"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Main carousel container */}
      <div className="relative h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
        {/* Slides */}
        {flowerImages.map((flower, index) => (
          <div
            key={flower.id}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <img src={flower.image || "/placeholder.svg"} alt={flower.title} className="w-full h-full object-cover" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-background">{flower.title}</h3>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-colors rounded-full p-2 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background transition-colors rounded-full p-2 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {flowerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-8" : "bg-primary/30 w-2 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
