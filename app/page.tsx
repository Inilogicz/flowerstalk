import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import TrustStats from "@/components/trust-stats"
import HowItWorks from "@/components/how-it-works"
import FeaturedCollections from "@/components/featured-collections"
import Footer from "@/components/footer"
import NewAddressModal from "@/components/new-address-modal"

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <Header />
      <HeroCarousel />
      <TrustStats />
      <HowItWorks />
      <FeaturedCollections />
      <Footer />
      <NewAddressModal />

    </main>
  )
}
