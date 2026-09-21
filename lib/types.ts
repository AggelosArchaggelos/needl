export type Locale = "en" | "el";

export type Localized = {
  en: string;
  el: string;
};

export type PriceBand = "€" | "€€" | "€€€";

export type TattooStyle = {
  guide?: { summary: Localized; description: Localized; example: Localized; comparison: Localized };
  id: string;
  name: Localized;
};

export type City = {
  id: string;
  name: Localized;
  region: Localized;
};

export type PortfolioPiece = {
  id: string;
  imageUrl: string;
  kind?: "tattoo" | "piercing" | "art";
  styleId?: string;
  caption: string;
  priceEUR?: number;
};

export type Artist = {
  rating?: number;
  reviewCount?: number;
  discipline?: "tattoo" | "piercing" | "both" | "art";
  piercingSpecialities?: string;
  id: string;
  slug: string;
  name: string;
  studioSlug: string;
  role: Localized;
  bio: Localized;
  yearsExperience: number;
  avatarUrl: string;
  instagramHandle: string;
  styleIds: string[];
  portfolio: PortfolioPiece[];
};

export type Studio = {
  experimental?: boolean;
  email?: string;
  coordinates?: { latitude: number; longitude: number };
  websiteUrl?: string;
  id: string;
  slug: string;
  name: string;
  cityId: string;
  neighborhood: Localized;
  address: string;
  description: Localized;
  heroImageUrl: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  priceBand: PriceBand;
  avgSessionEUR: number;
  styleIds: string[];
  instagramHandle: string;
  phone: string;
  hours: Localized;
  promoted: boolean;
  artists: Artist[];
};

export type BrowseFilters = {
  cityId: string | "all";
  styleIds: string[];
  kind?: "all" | "tattoo" | "piercing";
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  imageUrl: string;
  sourceName: string;
  sourceUrl?: string;
  publishedAt: string;
  tags: string[];
};

export type PricingTier = {
  name: Localized;
  price: Localized;
  period: Localized;
  highlight: boolean;
  description: Localized;
  features: Localized[];
};

export type SiteConfig = {
  siteName: string;
  tagline: Localized;
  contactEmail: string;
  instagramHandle: string;
  features: {
    news: boolean;
  };
  pricingTiers: PricingTier[];
};
