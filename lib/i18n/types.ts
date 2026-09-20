export type Locale = "de" | "en";

export type Dictionary = {
  nav: { orderCta: string };
  hero: { title: string; subtitle: string; cta: string };
  howItWorks: {
    title: string;
    steps: { title: string; text: string }[];
  };
  gallery: { title: string };
  pricing: {
    title: string;
    qualityLabel: string;
    sizeLabel: string;
    quality: { basic: string; standard: string; premium: string };
  };
  deliveryZone: {
    title: string;
    vienna: string;
    other: string;
  };
  footer: { contactTitle: string };
  orderForm: {
    title: string;
    pathFull: string;
    pathQuick: string;
    nameLabel: string;
    phoneLabel: string;
    qualityLabel: string;
    colorLabel: string;
    sizeLabel: string;
    scheduleTitle: string;
    sameEveryDayLabel: string;
    extraTextLabel: string;
    submit: string;
    successMessage: string;
    errorMessage: string;
  };
};
