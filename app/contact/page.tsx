import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin } from "lucide-react"

export default function Contact() {
  return (
    <main className="flex flex-col w-full">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-rose-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Get In Touch</h1>
          <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            {[
              {
                icon: Phone,
                title: "Call Us",
                details: "0817921852\n9 AM - 6 PM (Mon-Fri)",
              },
              {
                icon: Mail,
                title: "Email Us",
                details: "hello@flowerstalk.com\ninfo@flowerstalk.com",
              },
              {
                icon: MapPin,
                title: "Visit Us",
                details: "123 Flower Street\nNew York, NY 10001",
              },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="bg-card rounded-2xl p-8 border border-border text-center">
                  <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{item.details}</p>
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600"
              />

              <textarea
                placeholder="Your Message"
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-600 resize-none"
              />

              <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3">Send Message</Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
