import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Scrollytelling } from "@/components/Scrollytelling";
import { Pricing } from "@/components/Pricing";
import { DeliveryZone } from "@/components/DeliveryZone";
import { Footer } from "@/components/Footer";
import { OrderForm } from "@/components/order-form/OrderForm";

export default function Home() {
  return (
    <LanguageProvider>
      <LanguageToggle />
      <main>
        <Scrollytelling />
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
