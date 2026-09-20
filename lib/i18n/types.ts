export type Locale = "de" | "en";

export type Dictionary = {
  nav: { orderCta: string };
  hero: { title: string; subtitle: string; cta: string };
  howItWorks: {
    title: string;
    steps: { title: string; text: string }[];
  };
  gallery: { title: string };
  scrollytelling: {
    chapterLabel: string;
    scenes: [string, string, string];
    secondaryCta: string;
  };
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
    colorNames: { white: string; black: string; gold: string; silver: string };
    dayLabels: { mon: string; tue: string; wed: string; thu: string; fri: string; sat: string; sun: string };
  };
};
