import type { Dictionary, Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = {
  de: {
    nav: { orderCta: "Jetzt bestellen" },
    hero: {
      title: "Ihre Öffnungszeiten. Professionell geklebt.",
      subtitle:
        "Aufkleber aus Folie statt handgeschriebenem Zettel — in Wien kleben wir direkt vor Ort, überall sonst schicken wir ihn per Post.",
      cta: "Jetzt bestellen",
    },
    howItWorks: {
      title: "So funktioniert's",
      steps: [
        { title: "Auswählen", text: "Farbe, Größe und Öffnungszeiten festlegen." },
        { title: "Absenden", text: "Bestellung abschicken, wir melden uns." },
        { title: "Fertig", text: "Wir kleben es in Wien, oder Sie kleben es selbst nach Postversand." },
      ],
    },
    gallery: { title: "Beispiele" },
    scrollytelling: {
      chapterLabel: "Kapitel",
      scenes: ["Präzision", "Ablauf", "Beispiele"],
      secondaryCta: "Weiter entdecken",
    },
    pricing: {
      title: "Preise",
      qualityLabel: "Qualität",
      sizeLabel: "Größe",
      quality: {
        basic: "Basic (3 Jahre)",
        standard: "Standard (5 Jahre)",
        premium: "Premium (8-10 Jahre)",
      },
    },
    deliveryZone: {
      title: "Lieferung",
      vienna: "Wien — wir kommen vorbei und kleben es an Ort und Stelle.",
      other: "Außerhalb Wiens — wir schicken den fertigen Aufkleber per Post, Sie kleben ihn selbst.",
    },
    footer: { contactTitle: "Kontakt" },
    orderForm: {
      title: "Bestellung aufgeben",
      pathFull: "Selbst konfigurieren",
      pathQuick: "Nur Kontakt hinterlassen",
      nameLabel: "Name",
      phoneLabel: "Telefon",
      qualityLabel: "Qualität",
      colorLabel: "Farbe",
      sizeLabel: "Größe",
      scheduleTitle: "Öffnungszeiten",
      sameEveryDayLabel: "Jeden Tag dieselben Zeiten",
      extraTextLabel: "Zusatztext (optional)",
      submit: "Absenden",
      successMessage: "Danke! Wir melden uns telefonisch bei Ihnen.",
      errorMessage: "Etwas ist schiefgelaufen. Bitte rufen Sie uns direkt an.",
      colorNames: { white: "Weiß", black: "Schwarz", gold: "Gold", silver: "Silber" },
      dayLabels: { mon: "Mo", tue: "Di", wed: "Mi", thu: "Do", fri: "Fr", sat: "Sa", sun: "So" },
    },
  },
  en: {
    nav: { orderCta: "Order now" },
    hero: {
      title: "Your opening hours. Professionally applied.",
      subtitle:
        "A vinyl sticker instead of a handwritten note — in Vienna we install it for you, anywhere else we mail it and you apply it yourself.",
      cta: "Order now",
    },
    howItWorks: {
      title: "How it works",
      steps: [
        { title: "Choose", text: "Pick color, size and your opening hours." },
        { title: "Send", text: "Submit the order, we'll get in touch." },
        { title: "Done", text: "We install it in Vienna, or you apply it yourself after we mail it." },
      ],
    },
    gallery: { title: "Examples" },
    scrollytelling: {
      chapterLabel: "Chapter",
      scenes: ["Precision", "Process", "Examples"],
      secondaryCta: "Keep exploring",
    },
    pricing: {
      title: "Pricing",
      qualityLabel: "Quality",
      sizeLabel: "Size",
      quality: {
        basic: "Basic (3 years)",
        standard: "Standard (5 years)",
        premium: "Premium (8-10 years)",
      },
    },
    deliveryZone: {
      title: "Delivery",
      vienna: "Vienna — we come by and install it on site.",
      other: "Outside Vienna — we mail the finished sticker, you apply it yourself.",
    },
    footer: { contactTitle: "Contact" },
    orderForm: {
      title: "Place an order",
      pathFull: "Configure it myself",
      pathQuick: "Just leave my contact",
      nameLabel: "Name",
      phoneLabel: "Phone",
      qualityLabel: "Quality",
      colorLabel: "Color",
      sizeLabel: "Size",
      scheduleTitle: "Opening hours",
      sameEveryDayLabel: "Same hours every day",
      extraTextLabel: "Extra text (optional)",
      submit: "Submit",
      successMessage: "Thanks! We'll call you back.",
      errorMessage: "Something went wrong. Please call us directly.",
      colorNames: { white: "White", black: "Black", gold: "Gold", silver: "Silver" },
      dayLabels: { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" },
    },
  },
};
