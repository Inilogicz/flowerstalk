export default function TrustStats() {
  const stats = [
    { value: "100%", label: "Premium Quality" },
    { value: "98%", label: "Happy Customers" },
    { value: "99.8%", label: "On-Time Delivery" },
    { value: "Yes", label: "Eco-Friendly" },
  ]

  return (
    <section className="w-full bg-secondary/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-sm font-semibold text-muted-foreground tracking-widest mb-12">
          TRUSTED BY THOUSANDS
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
