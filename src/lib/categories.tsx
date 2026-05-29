import React from "react";

// ---------------------------------------------------------------------------
// Hausa translations
// ---------------------------------------------------------------------------
export const CATEGORY_HAUSA: Record<string, string> = {
  "Food & Drinks": "Abinci",
  Fashion: "Kayan Moda",
  Beauty: "Kyau",
  Home: "Gida",
  "Home & Living": "Gida da Rayuwa",
  Crafts: "Sana'a",
  Services: "Hidima",
  Electronics: "Na'urorin Lantarki",
  Other: "Sauran",
};

export function hausaFor(name?: string | null): string | null {
  if (!name) return null;
  return CATEGORY_HAUSA[name] ?? null;
}

// ---------------------------------------------------------------------------
// City list
// ---------------------------------------------------------------------------
export const NIGERIAN_CITIES = [
  "Abuja",
  "Azare",
  "Bauchi",
  "Birnin Kebbi",
  "Dutse",
  "Funtua",
  "Gombe",
  "Gusau",
  "Hadejia",
  "Ilorin",
  "Jalingo",
  "Jos",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kontagora",
  "Lafia",
  "Maiduguri",
  "Minna",
  "Potiskum",
  "Sokoto",
  "Yola",
  "Zaria",
  "Other",
];

// ---------------------------------------------------------------------------
// Icon component type
// ---------------------------------------------------------------------------
export type CategoryIconComponent = React.FC<{ size?: number; className?: string }>;

export type CategoryIconConfig = {
  Component: CategoryIconComponent;
  /** Tailwind classes for the icon container card */
  containerClass: string;
};

// ---------------------------------------------------------------------------
// Individual SVG icons — each 40 × 40 viewBox, warm illustrated style
// ---------------------------------------------------------------------------

const FashionIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ankara-style fabric / dress silhouette */}
    <rect width="40" height="40" rx="12" fill="url(#fashion-bg)" />
    {/* Dress body */}
    <path d="M20 10 L26 16 L24 30 H16 L14 16 Z" fill="#fff" fillOpacity="0.9" />
    {/* Collar V */}
    <path d="M20 10 L23 16 H17 Z" fill="url(#fashion-collar)" />
    {/* Decorative pattern lines */}
    <line x1="17" y1="20" x2="23" y2="20" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16.5" y1="23" x2="23.5" y2="23" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="16" y1="26" x2="24" y2="26" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
    {/* Sleeves */}
    <path d="M14 16 L10 19 L13 21 L16 18Z" fill="#fff" fillOpacity="0.75" />
    <path d="M26 16 L30 19 L27 21 L24 18Z" fill="#fff" fillOpacity="0.75" />
    <defs>
      <linearGradient id="fashion-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F9A8D4" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
      <linearGradient id="fashion-collar" x1="17" y1="10" x2="23" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#BE185D" />
      </linearGradient>
    </defs>
  </svg>
);

const FoodIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#food-bg)" />
    {/* Clay pot body */}
    <ellipse cx="20" cy="25" rx="9" ry="7" fill="#fff" fillOpacity="0.9" />
    <ellipse cx="20" cy="18" rx="7" ry="3" fill="#fff" fillOpacity="0.85" />
    {/* Pot neck */}
    <rect x="15" y="18" width="10" height="3" fill="#fff" fillOpacity="0.9" rx="1" />
    {/* Lid */}
    <ellipse cx="20" cy="18" rx="7" ry="2.5" fill="url(#food-lid)" />
    <circle cx="20" cy="15.5" r="1.5" fill="#F59E0B" />
    {/* Steam lines */}
    <path d="M16 12 Q17 10 16 8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    <path d="M20 11 Q21 9 20 7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    <path d="M24 12 Q25 10 24 8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
    {/* Pot handles */}
    <path d="M11 24 Q9 24 9 26 Q9 28 11 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M29 24 Q31 24 31 26 Q31 28 29 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    <defs>
      <linearGradient id="food-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FCD34D" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="food-lid" x1="13" y1="18" x2="27" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F59E0B" />
        <stop offset="1" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

const BeautyIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#beauty-bg)" />
    {/* Perfume bottle */}
    <rect x="15" y="18" width="10" height="13" rx="3" fill="#fff" fillOpacity="0.9" />
    {/* Bottle neck */}
    <rect x="17.5" y="14" width="5" height="5" rx="1.5" fill="#fff" fillOpacity="0.85" />
    {/* Cap */}
    <rect x="16" y="11" width="8" height="4" rx="2" fill="url(#beauty-cap)" />
    {/* Liquid line */}
    <rect x="15" y="24" width="10" height="7" rx="3" fill="url(#beauty-liquid)" fillOpacity="0.5" />
    {/* Sparkles */}
    <path d="M10 14 L11 12 L12 14 L11 16Z" fill="#F9A8D4" />
    <path d="M28 10 L29 8 L30 10 L29 12Z" fill="#F9A8D4" />
    <circle cx="10" cy="25" r="1.2" fill="#F9A8D4" opacity="0.7" />
    <circle cx="30" cy="22" r="1.5" fill="#F9A8D4" opacity="0.7" />
    <defs>
      <linearGradient id="beauty-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDA4AF" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
      <linearGradient id="beauty-cap" x1="16" y1="11" x2="24" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#BE123C" />
      </linearGradient>
      <linearGradient id="beauty-liquid" x1="15" y1="24" x2="25" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB7185" />
        <stop offset="1" stopColor="#E11D48" />
      </linearGradient>
    </defs>
  </svg>
);

const HomeIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#home-bg)" />
    {/* Roof */}
    <path d="M8 20 L20 10 L32 20" fill="url(#home-roof)" />
    {/* Walls */}
    <rect x="12" y="20" width="16" height="12" rx="1" fill="#fff" fillOpacity="0.9" />
    {/* Door */}
    <rect x="17.5" y="24" width="5" height="8" rx="1.5" fill="url(#home-door)" />
    {/* Windows */}
    <rect x="13.5" y="22" width="4" height="4" rx="1" fill="#FEF3C7" opacity="0.9" />
    <rect x="22.5" y="22" width="4" height="4" rx="1" fill="#FEF3C7" opacity="0.9" />
    {/* Chimney */}
    <rect x="24" y="13" width="3" height="6" rx="1" fill="#fff" fillOpacity="0.7" />
    {/* Warm light from windows */}
    <rect x="14" y="22.5" width="3" height="3" rx="0.5" fill="#FCD34D" opacity="0.6" />
    <rect x="23" y="22.5" width="3" height="3" rx="0.5" fill="#FCD34D" opacity="0.6" />
    <defs>
      <linearGradient id="home-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE68A" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="home-roof" x1="8" y1="20" x2="32" y2="10" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D97706" />
        <stop offset="1" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="home-door" x1="17.5" y1="24" x2="22.5" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B45309" />
        <stop offset="1" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

const CraftsIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#crafts-bg)" />
    {/* Yarn ball */}
    <circle cx="22" cy="22" r="10" fill="#fff" fillOpacity="0.9" />
    {/* Yarn wrap lines */}
    <path d="M13 19 Q22 16 31 22" stroke="url(#crafts-yarn1)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M14 23 Q22 20 30 26" stroke="url(#crafts-yarn1)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M16 27 Q22 24 29 29" stroke="url(#crafts-yarn1)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M18 15 Q20 22 16 30" stroke="url(#crafts-yarn2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M22 13 Q24 22 20 31" stroke="url(#crafts-yarn2)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Needle */}
    <line x1="12" y1="12" x2="20" y2="20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#fff" fillOpacity="0.9" />
    <line x1="11" y1="9" x2="13" y2="12" stroke="#FB923C" strokeWidth="1.2" strokeLinecap="round" />
    <defs>
      <linearGradient id="crafts-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FED7AA" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="crafts-yarn1" x1="13" y1="19" x2="31" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FB923C" />
        <stop offset="1" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="crafts-yarn2" x1="18" y1="15" x2="16" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FED7AA" />
        <stop offset="1" stopColor="#FB923C" />
      </linearGradient>
    </defs>
  </svg>
);

const ServicesIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#services-bg)" />
    {/* Handshake */}
    {/* Left hand */}
    <path d="M8 22 L16 18 L18 21 L12 25 Z" fill="#fff" fillOpacity="0.9" />
    <path d="M16 18 L18 15 L20 17 L18 21Z" fill="#fff" fillOpacity="0.85" />
    {/* Right hand */}
    <path d="M32 22 L24 18 L22 21 L28 25 Z" fill="#fff" fillOpacity="0.9" />
    <path d="M24 18 L22 15 L20 17 L22 21Z" fill="#fff" fillOpacity="0.85" />
    {/* Clasped center */}
    <ellipse cx="20" cy="21" rx="4" ry="3" fill="url(#services-clasp)" />
    {/* Stars above */}
    <path d="M20 9 L21 12 L24 12 L21.5 14 L22.5 17 L20 15 L17.5 17 L18.5 14 L16 12 L19 12 Z" fill="#fff" fillOpacity="0.85" />
    <defs>
      <linearGradient id="services-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6EE7B7" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="services-clasp" x1="16" y1="21" x2="24" y2="21" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#065F46" />
      </linearGradient>
    </defs>
  </svg>
);

const ElectronicsIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#elec-bg)" />
    {/* Phone body */}
    <rect x="13" y="8" width="14" height="24" rx="3" fill="#fff" fillOpacity="0.9" />
    {/* Screen */}
    <rect x="15" y="12" width="10" height="14" rx="1.5" fill="url(#elec-screen)" />
    {/* Home button */}
    <circle cx="20" cy="29" r="1.5" fill="#fff" fillOpacity="0.6" />
    {/* Screen content — signal bars */}
    <rect x="17" y="20" width="2" height="3" rx="0.5" fill="#fff" opacity="0.5" />
    <rect x="20" y="18" width="2" height="5" rx="0.5" fill="#fff" opacity="0.7" />
    <rect x="23" y="16" width="2" height="7" rx="0.5" fill="#fff" opacity="0.9" />
    {/* Wireless signal arc */}
    <path d="M16 14 Q20 12 24 14" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
    <path d="M14 12 Q20 9 26 12" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4" />
    <defs>
      <linearGradient id="elec-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" />
        <stop offset="1" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="elec-screen" x1="15" y1="12" x2="25" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1D4ED8" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
  </svg>
);

const OtherIcon: CategoryIconComponent = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#other-bg)" />
    {/* Market bag */}
    <path d="M13 18 Q12 30 20 31 Q28 30 27 18 Z" fill="#fff" fillOpacity="0.9" />
    {/* Bag top stripe */}
    <rect x="12" y="17" width="16" height="3" rx="1" fill="#fff" />
    {/* Handles */}
    <path d="M15 17 Q15 12 20 12 Q25 12 25 17" stroke="url(#other-handle)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Tag */}
    <rect x="17" y="21" width="6" height="4" rx="1" fill="url(#other-tag)" opacity="0.8" />
    <line x1="20" y1="21" x2="20" y2="18" stroke="#CBD5E1" strokeWidth="1" />
    {/* Stars / sparkle */}
    <circle cx="10" cy="13" r="1.5" fill="#fff" opacity="0.5" />
    <circle cx="30" cy="15" r="1" fill="#fff" opacity="0.5" />
    <circle cx="28" cy="10" r="2" fill="#fff" opacity="0.4" />
    <defs>
      <linearGradient id="other-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD" />
        <stop offset="1" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="other-handle" x1="15" y1="12" x2="25" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A78BFA" />
        <stop offset="1" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="other-tag" x1="17" y1="21" x2="23" y2="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7C3AED" />
        <stop offset="1" stopColor="#4C1D95" />
      </linearGradient>
    </defs>
  </svg>
);

// ---------------------------------------------------------------------------
// Icon registry
// ---------------------------------------------------------------------------
export const CATEGORY_ICON: Record<string, CategoryIconConfig> = {
  Fashion: {
    Component: FashionIcon,
    containerClass: "bg-pink-50",
  },
  "Food & Drinks": {
    Component: FoodIcon,
    containerClass: "bg-amber-50",
  },
  Beauty: {
    Component: BeautyIcon,
    containerClass: "bg-rose-50",
  },
  Home: {
    Component: HomeIcon,
    containerClass: "bg-yellow-50",
  },
  "Home & Living": {
    Component: HomeIcon,
    containerClass: "bg-yellow-50",
  },
  Crafts: {
    Component: CraftsIcon,
    containerClass: "bg-orange-50",
  },
  Services: {
    Component: ServicesIcon,
    containerClass: "bg-emerald-50",
  },
  Electronics: {
    Component: ElectronicsIcon,
    containerClass: "bg-blue-50",
  },
  Other: {
    Component: OtherIcon,
    containerClass: "bg-violet-50",
  },
};

export function iconFor(name?: string | null): CategoryIconConfig {
  if (!name) return CATEGORY_ICON.Other;
  return CATEGORY_ICON[name] ?? CATEGORY_ICON.Other;
}

// ---------------------------------------------------------------------------
// Legacy compat — some pages imported `tint` or used `Icon` directly.
// This shim keeps those call sites working without a larger refactor.
// ---------------------------------------------------------------------------
export type { CategoryIconConfig as CategoryIcon };
