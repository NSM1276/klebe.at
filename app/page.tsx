import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Gallery } from "@/components/Gallery";
import { Pricing } from "@/components/Pricing";
import { DeliveryZone } from "@/components/DeliveryZone";
import { Footer } from "@/components/Footer";
import { OrderForm } from "@/components/order-form/OrderForm";

export default function Home() {
  return (
    <LanguageProvider>
      <LanguageToggle />
      <main>
        <Hero />
        <HowItWorks />
        <Gallery />
        <Pricing />
        <section id="order" className="px-6 py-16 max-w-4xl mx-auto">
          <OrderForm />
        </section>
        <DeliveryZone />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
