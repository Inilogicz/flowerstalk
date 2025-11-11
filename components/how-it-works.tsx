import { Flower, Palette, MapPin, CreditCard, Truck } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Choose Flower",
      description: "Browse our beautiful collection of fresh flowers and arrangements",
      icon: Flower,
    },
    {
      number: 2,
      title: "Select Type",
      description: "Pick your favorite bouquet or custom arrangement",
      icon: Palette,
    },
    {
      number: 3,
      title: "Order Method",
      description: "Choose pickup from store or delivery to your location",
      icon: MapPin,
    },
    {
      number: 4,
      title: "Make Payment",
      description: "Secure online payment or pay on pickup",
      icon: CreditCard,
    },
    {
      number: 5,
      title: "Track Order",
      description: "Monitor your order status in real-time",
      icon: Truck,
    },
  ]

  return (
    <section className="w-full bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-2">How It Works</h2>
        <p className="text-center text-muted-foreground mb-12">
          Simple and seamless process to get your beautiful flowers delivered
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {/* Step Card */}
                <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector Line */}
                {step.number < steps.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
