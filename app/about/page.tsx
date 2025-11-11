import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function About() {
  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-rose-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">About FlowerStalk</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Dedicated to spreading joy and beauty through carefully curated floral arrangements
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FlowerStalk was founded with a simple mission: to deliver happiness through beautiful, fresh flowers.
                Every arrangement is handpicked by our expert florists to ensure the highest quality and freshness.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We believe that flowers have the power to transform moments into memories. Whether you're celebrating a
                special occasion or simply brightening someone's day, our premium collection has something for everyone.
              </p>
              <Button className="bg-rose-600 hover:bg-rose-700 text-white">Explore Our Collection</Button>
            </div>
            <div className="relative h-96 rounded-3xl overflow-hidden">
              <Image src="/placeholder.svg?key=about1" alt="Our Story" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-secondary/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality First",
                description: "Every flower is hand-selected to ensure premium quality and longevity",
              },
              {
                title: "Fresh Always",
                description: "Our flowers are sourced daily from local and international growers",
              },
              {
                title: "Customer Care",
                description: "Your satisfaction is our priority with same-day delivery and support",
              },
            ].map((value, idx) => (
              <div key={idx} className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
