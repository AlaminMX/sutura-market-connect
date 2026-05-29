import React from "react";

// ---------------------------------------------------------------------------
// Hausa translations
// ---------------------------------------------------------------------------
export const CATEGORY_HAUSA: Record<string, string> = {
  "Home & Living": "Gida da Kayan Gida",
  "Food & Homemade Goods": "Abinci da Kayan Gida",
  "Fashion & Clothing": "Tufafin Mace",
  "Beauty & Skincare": "Kyau da Kulawa",
  "Crafts & Handmade": "Sana'ar Gargajiya",
  "Accessories": "Kayan Ado",
  // kept for compat
  "Jewelry & Accessories": "Kayan Ado",
  "Traditional Crafts": "Sana'ar Gargajiya",
  "Beauty & Personal Care": "Kyau da Kulawa",
  "Modest Fashion": "Tufafin Mace",
  "Food & Groceries": "Abinci da Kayan Miya",
  "Food & Drinks": "Abinci",
  Fashion: "Kayan Moda",
  Beauty: "Kyau",
  Home: "Gida",
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
  "Abuja","Azare","Bauchi","Birnin Kebbi","Dutse","Funtua","Gombe","Gusau",
  "Hadejia","Ilorin","Jalingo","Jos","Kaduna","Kano","Katsina","Kontagora",
  "Lafia","Maiduguri","Minna","Potiskum","Sokoto","Yola","Zaria","Other",
];

// ---------------------------------------------------------------------------
// Icon types
// ---------------------------------------------------------------------------
export type CategoryIconComponent = React.FC<{ size?: number; className?: string }>;
export type CategoryIconConfig = {
  Component: CategoryIconComponent;
  containerClass: string;
};

// ---------------------------------------------------------------------------
// SVG Icons — illustrated warm style, exactly matching reference image
// ---------------------------------------------------------------------------

/* 1. HOME & LIVING — house frame with sofa, lamp, plant */
const HomeAndLivingIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Roof */}
    <path d="M8 26 L28 10 L48 26" stroke="#C0601A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Left wall */}
    <line x1="13" y1="26" x2="13" y2="46" stroke="#C0601A" strokeWidth="2" strokeLinecap="round"/>
    {/* Right wall */}
    <line x1="43" y1="26" x2="43" y2="46" stroke="#C0601A" strokeWidth="2" strokeLinecap="round"/>
    {/* Floor */}
    <line x1="13" y1="46" x2="43" y2="46" stroke="#C0601A" strokeWidth="2" strokeLinecap="round"/>
    {/* Sofa base */}
    <rect x="17" y="37" width="22" height="7" rx="2" fill="#E8935A" opacity="0.85"/>
    {/* Sofa back */}
    <rect x="17" y="33" width="22" height="6" rx="2" fill="#D4724A" opacity="0.85"/>
    {/* Sofa arm left */}
    <rect x="15" y="35" width="4" height="9" rx="1.5" fill="#D4724A" opacity="0.85"/>
    {/* Sofa arm right */}
    <rect x="37" y="35" width="4" height="9" rx="1.5" fill="#D4724A" opacity="0.85"/>
    {/* Sofa cushion line */}
    <line x1="28" y1="33" x2="28" y2="44" stroke="#C0601A" strokeWidth="0.8" opacity="0.5"/>
    {/* Hanging lamp left of center */}
    <line x1="22" y1="10" x2="22" y2="20" stroke="#C0601A" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M18 20 Q22 18 26 20 L25 26 Q22 27 19 26 Z" fill="#F5C518" opacity="0.9"/>
    <ellipse cx="22" cy="20" rx="4" ry="1.2" fill="#D4A017"/>
    {/* Small plant right side */}
    <line x1="39" y1="46" x2="39" y2="40" stroke="#8B4513" strokeWidth="1.5" strokeLinecap="round"/>
    <ellipse cx="39" cy="38" rx="3.5" ry="3" fill="#5F8A2A"/>
    <ellipse cx="36" cy="39.5" rx="2.5" ry="2" fill="#4A7020"/>
    <ellipse cx="42" cy="39.5" rx="2.5" ry="2" fill="#4A7020"/>
  </svg>
);

/* 2. ACCESSORIES — gold necklace with 3 teardrop pendants + sparkles */
const AccessoriesIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Chain arc across top */}
    <path d="M13 20 Q28 11 43 20" stroke="#D4A017" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    {/* Left chain side down */}
    <path d="M13 20 Q10 28 16 35" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Right chain side down */}
    <path d="M43 20 Q46 28 40 35" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Bottom chain connector */}
    <path d="M16 35 Q28 39 40 35" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" fill="none"/>

    {/* Center large teardrop pendant */}
    <ellipse cx="28" cy="44" rx="5.5" ry="7.5" fill="url(#acc-gold-c)"/>
    <ellipse cx="26.5" cy="40" rx="2" ry="3" fill="#FFE57A" opacity="0.55"/>
    <line x1="28" y1="36" x2="28" y2="38.5" stroke="#C8960C" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Left teardrop pendant */}
    <ellipse cx="18" cy="41" rx="3.8" ry="5.2" fill="url(#acc-gold-s)"/>
    <ellipse cx="17" cy="38" rx="1.4" ry="2.2" fill="#FFE57A" opacity="0.5"/>
    <line x1="18" y1="35" x2="18" y2="37" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round"/>

    {/* Right teardrop pendant */}
    <ellipse cx="38" cy="41" rx="3.8" ry="5.2" fill="url(#acc-gold-s)"/>
    <ellipse cx="37" cy="38" rx="1.4" ry="2.2" fill="#FFE57A" opacity="0.5"/>
    <line x1="38" y1="35" x2="38" y2="37" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round"/>

    {/* Sparkles */}
    <path d="M9 16 L9.7 13 L10.4 16 L9.7 19Z" fill="#F5C518" opacity="0.95"/>
    <path d="M47 13 L47.5 11 L48 13 L47.5 15Z" fill="#F5C518" opacity="0.85"/>
    <circle cx="46" cy="22" r="1.3" fill="#F5C518" opacity="0.8"/>
    <circle cx="8" cy="24" r="1.1" fill="#F5C518" opacity="0.75"/>
    <circle cx="44" cy="9" r="1.8" fill="#F5C518" opacity="0.7"/>

    <defs>
      <linearGradient id="acc-gold-c" x1="22.5" y1="36.5" x2="33.5" y2="51.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD54F"/>
        <stop offset="1" stopColor="#A67C00"/>
      </linearGradient>
      <linearGradient id="acc-gold-s" x1="14" y1="35" x2="22" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD54F"/>
        <stop offset="1" stopColor="#A67C00"/>
      </linearGradient>
    </defs>
  </svg>
);

/* 3. CRAFTS & HANDMADE — clay pot on decorative tray */
const CraftsIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Decorative plate/tray */}
    <ellipse cx="28" cy="46" rx="20" ry="4.5" fill="url(#cr-plate)"/>
    <ellipse cx="28" cy="46" rx="20" ry="4.5" fill="none" stroke="#9C4A1A" strokeWidth="1.3"/>
    <ellipse cx="28" cy="46" rx="14" ry="3" fill="none" stroke="#9C4A1A" strokeWidth="0.8" strokeDasharray="2.5 2"/>

    {/* Pot body */}
    <ellipse cx="28" cy="37" rx="13" ry="10" fill="url(#cr-body)"/>
    {/* Highlight */}
    <ellipse cx="22" cy="32" rx="4" ry="5.5" fill="white" opacity="0.18"/>

    {/* Pot neck */}
    <rect x="22" y="24" width="12" height="6" rx="1.5" fill="url(#cr-neck)"/>

    {/* Pot rim */}
    <ellipse cx="28" cy="24" rx="8" ry="2.5" fill="url(#cr-rim)"/>

    {/* Handles */}
    <path d="M15 35 Q10 35 10 38.5 Q10 42 15 42" stroke="#8B3A0F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M41 35 Q46 35 46 38.5 Q46 42 41 42" stroke="#8B3A0F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

    {/* Decorative etched lines on pot */}
    <path d="M18 35 Q28 33 38 35" stroke="#A0440F" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55"/>
    <path d="M17 39 Q28 37 39 39" stroke="#A0440F" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55"/>

    <defs>
      <linearGradient id="cr-plate" x1="8" y1="46" x2="48" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0B080"/>
        <stop offset="1" stopColor="#A05020"/>
      </linearGradient>
      <linearGradient id="cr-body" x1="15" y1="27" x2="41" y2="47" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D2794A"/>
        <stop offset="1" stopColor="#7A2E08"/>
      </linearGradient>
      <linearGradient id="cr-neck" x1="22" y1="24" x2="34" y2="30" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C0601A"/>
        <stop offset="1" stopColor="#7A2E08"/>
      </linearGradient>
      <linearGradient id="cr-rim" x1="20" y1="24" x2="36" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DEB87A"/>
        <stop offset="1" stopColor="#CD7030"/>
      </linearGradient>
    </defs>
  </svg>
);

/* 4. BEAUTY & SKINCARE — woman with pink head towel applying cotton pad to cheek */
const BeautyIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Towel wrap */}
    <path d="M15 23 Q16 11 28 10 Q40 11 41 23 Q44 18 41 14 Q36 5 28 6 Q20 5 15 14 Q12 18 15 23Z" fill="#FF8FAB"/>
    {/* Towel twist knot */}
    <ellipse cx="33" cy="10" rx="5" ry="3.5" fill="#FF8FAB" transform="rotate(-25 33 10)"/>
    <ellipse cx="36" cy="8" rx="3.5" ry="2.5" fill="#FFB6C8" transform="rotate(-35 36 8)"/>

    {/* Face */}
    <ellipse cx="28" cy="31" rx="11.5" ry="12.5" fill="url(#bt-skin)"/>
    {/* Neck */}
    <rect x="24" y="41" width="8" height="7" rx="2.5" fill="url(#bt-skin2)"/>

    {/* Eyes */}
    <ellipse cx="23" cy="29" rx="2.2" ry="1.7" fill="#4A2810"/>
    <ellipse cx="33" cy="29" rx="2.2" ry="1.7" fill="#4A2810"/>
    <circle cx="24" cy="28.3" r="0.7" fill="white"/>
    <circle cx="34" cy="28.3" r="0.7" fill="white"/>

    {/* Eyebrows */}
    <path d="M20 26 Q23 24.2 26 26" stroke="#4A2810" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M30 26 Q33 24.2 36 26" stroke="#4A2810" strokeWidth="1.3" strokeLinecap="round" fill="none"/>

    {/* Nose */}
    <path d="M27 33 Q28 35 29 33" stroke="#BF8055" strokeWidth="1.1" strokeLinecap="round" fill="none"/>

    {/* Smile */}
    <path d="M24 37 Q28 40 32 37" stroke="#C94050" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

    {/* Cheek blush */}
    <ellipse cx="19" cy="33" rx="3" ry="2" fill="#FFB6C1" opacity="0.55"/>
    <ellipse cx="37" cy="33" rx="3" ry="2" fill="#FFB6C1" opacity="0.55"/>

    {/* Right arm + cotton pad on cheek */}
    <path d="M41 35 Q47 32 46 28" stroke="#D4956A" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <ellipse cx="40" cy="35" rx="4.5" ry="3.5" fill="white" stroke="#E8D0D0" strokeWidth="1.2"/>

    <defs>
      <linearGradient id="bt-skin" x1="16.5" y1="18.5" x2="39.5" y2="43.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDDBB4"/>
        <stop offset="1" stopColor="#C8855A"/>
      </linearGradient>
      <linearGradient id="bt-skin2" x1="24" y1="41" x2="32" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F0C898"/>
        <stop offset="1" stopColor="#C8855A"/>
      </linearGradient>
    </defs>
  </svg>
);

/* 5. FASHION & CLOTHING — woman in dark flowing abaya + hijab */
const FashionIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Hijab outer shape */}
    <path d="M16 22 Q16 9 28 8 Q40 9 40 22 Q44 20 44 26 Q41 21 37 21 L35 48 L21 48 L19 21 Q15 21 12 26 Q12 20 16 22Z" fill="url(#fa-dark)"/>

    {/* Face oval */}
    <ellipse cx="28" cy="20" rx="8" ry="9" fill="url(#fa-skin)"/>

    {/* Hijab framing around face (chin/sides) */}
    <path d="M19 21 Q19 30 21 32 L21 24 Q24 22 28 22 Q32 22 35 24 L35 32 Q37 30 37 21 Q34 18 28 18 Q22 18 19 21Z" fill="#2A1008"/>

    {/* Abaya body flowing */}
    <path d="M21 24 Q16 28 12 38 Q10 44 13 49 L43 49 Q46 44 44 38 Q40 28 35 24 L33 48 L23 48 Z" fill="url(#fa-dark)"/>

    {/* Left sleeve */}
    <path d="M21 26 Q14 30 10 37 Q12 40 14 38 Q17 32 22 29Z" fill="url(#fa-dark)"/>
    {/* Right sleeve */}
    <path d="M35 26 Q42 30 46 37 Q44 40 42 38 Q39 32 34 29Z" fill="url(#fa-dark)"/>

    {/* Subtle fold lines */}
    <path d="M26 28 Q25 38 26 48" stroke="#1A0805" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M30 28 Q31 38 30 48" stroke="#1A0805" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.5"/>

    {/* Face details */}
    <ellipse cx="24" cy="20" rx="1.6" ry="1.3" fill="#3C2010"/>
    <ellipse cx="32" cy="20" rx="1.6" ry="1.3" fill="#3C2010"/>
    <circle cx="24.6" cy="19.4" r="0.6" fill="white"/>
    <circle cx="32.6" cy="19.4" r="0.6" fill="white"/>
    <path d="M25.5 24 Q28 26 30.5 24" stroke="#B06040" strokeWidth="1.1" strokeLinecap="round" fill="none"/>

    <defs>
      <linearGradient id="fa-dark" x1="10" y1="8" x2="46" y2="49" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4A2210"/>
        <stop offset="1" stopColor="#150804"/>
      </linearGradient>
      <linearGradient id="fa-skin" x1="20" y1="11" x2="36" y2="29" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDDBB4"/>
        <stop offset="1" stopColor="#C8855A"/>
      </linearGradient>
    </defs>
  </svg>
);

/* 6. FOOD & HOMEMADE GOODS — terracotta pot with flying vegetables */
const FoodIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Pot body */}
    <ellipse cx="28" cy="40" rx="15" ry="11" fill="url(#fd-pot)"/>
    {/* Highlight on pot */}
    <ellipse cx="22" cy="35" rx="4.5" ry="6" fill="white" opacity="0.14"/>

    {/* Pot rim */}
    <ellipse cx="28" cy="29" rx="15" ry="4" fill="url(#fd-rim)"/>

    {/* Lid */}
    <ellipse cx="28" cy="28" rx="15" ry="4" fill="url(#fd-lid)"/>
    <ellipse cx="28" cy="25.5" rx="11" ry="3" fill="url(#fd-lid-top)"/>
    {/* Lid knob */}
    <ellipse cx="28" cy="23" rx="3.5" ry="2" fill="#C0601A"/>
    <ellipse cx="28" cy="22" rx="2" ry="1.2" fill="#E07830"/>

    {/* Handles */}
    <path d="M13 38 Q8 38 8 41.5 Q8 45 13 45" stroke="#8B3A0F" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    <path d="M43 38 Q48 38 48 41.5 Q48 45 43 45" stroke="#8B3A0F" strokeWidth="2.8" strokeLinecap="round" fill="none"/>

    {/* --- Flying ingredients --- */}
    {/* Large tomato top-right */}
    <circle cx="38" cy="13" r="6" fill="#E8332A"/>
    <ellipse cx="38" cy="13" rx="2" ry="4" fill="#C02020" opacity="0.35"/>
    <ellipse cx="36.5" cy="10.5" rx="1.5" ry="1" fill="#FF6A60" opacity="0.5"/>
    {/* Tomato stem */}
    <path d="M36 8 Q38 6 40 8" stroke="#3A7A18" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <line x1="38" y1="7" x2="38" y2="9" stroke="#3A7A18" strokeWidth="1.5" strokeLinecap="round"/>

    {/* Leaf/herb top-left */}
    <path d="M18 19 Q13 12 18 7 Q23 12 18 19Z" fill="#5A9A2A"/>
    <path d="M18 19 L18 7" stroke="#3A7A18" strokeWidth="1.2" strokeLinecap="round"/>

    {/* Small orange dot upper center */}
    <circle cx="27" cy="8" r="3.5" fill="#F5901A"/>
    <ellipse cx="26" cy="7" rx="1.2" ry="1" fill="#FFB84A" opacity="0.6"/>

    {/* Small green herb right */}
    <path d="M44" cy="22" />
    <ellipse cx="44" cy="22" rx="2.5" ry="2" fill="#5A9A2A" opacity="0.9"/>
    <line x1="44" y1="24" x2="44" y2="27" stroke="#3A7A18" strokeWidth="1.2" strokeLinecap="round"/>

    {/* Steam from lid */}
    <path d="M22 26 Q21 21 22 17" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45"/>
    <path d="M28 25 Q27 19 28 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45"/>
    <path d="M34 26 Q35 21 34 17" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.45"/>

    <defs>
      <linearGradient id="fd-pot" x1="13" y1="29" x2="43" y2="51" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E8935A"/>
        <stop offset="1" stopColor="#8B3A0F"/>
      </linearGradient>
      <linearGradient id="fd-rim" x1="13" y1="29" x2="43" y2="33" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DEBA8A"/>
        <stop offset="1" stopColor="#C07030"/>
      </linearGradient>
      <linearGradient id="fd-lid" x1="13" y1="24" x2="43" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFB07A"/>
        <stop offset="1" stopColor="#B05A1A"/>
      </linearGradient>
      <linearGradient id="fd-lid-top" x1="17" y1="22.5" x2="39" y2="28.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFD0A0"/>
        <stop offset="1" stopColor="#D07830"/>
      </linearGradient>
    </defs>
  </svg>
);

/* Fallback */
const OtherIcon: CategoryIconComponent = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="16" fill="url(#ot-bg)"/>
    <path d="M18 24 Q17 40 28 42 Q39 40 38 24 Z" fill="#fff" fillOpacity="0.9"/>
    <rect x="17" y="22" width="22" height="4" rx="1" fill="#fff"/>
    <path d="M21 22 Q21 15 28 15 Q35 15 35 22" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <defs>
      <linearGradient id="ot-bg" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C4B5FD"/><stop offset="1" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
  </svg>
);

// ---------------------------------------------------------------------------
// Registry — ACTUAL DB names first, then legacy aliases
// ---------------------------------------------------------------------------
export const CATEGORY_ICON: Record<string, CategoryIconConfig> = {
  // ── Actual DB category names ──────────────────────────────────────────────
  "Home & Living":          { Component: HomeAndLivingIcon, containerClass: "bg-amber-50" },
  "Accessories":            { Component: AccessoriesIcon,   containerClass: "bg-yellow-50" },
  "Crafts & Handmade":      { Component: CraftsIcon,        containerClass: "bg-orange-50" },
  "Beauty & Skincare":      { Component: BeautyIcon,        containerClass: "bg-pink-50" },
  "Fashion & Clothing":     { Component: FashionIcon,       containerClass: "bg-stone-50" },
  "Food & Homemade Goods":  { Component: FoodIcon,          containerClass: "bg-red-50" },

  // ── Legacy / alternate names (keep working) ───────────────────────────────
  "Home":                   { Component: HomeAndLivingIcon, containerClass: "bg-amber-50" },
  "Jewelry & Accessories":  { Component: AccessoriesIcon,   containerClass: "bg-yellow-50" },
  "Traditional Crafts":     { Component: CraftsIcon,        containerClass: "bg-orange-50" },
  "Beauty & Personal Care": { Component: BeautyIcon,        containerClass: "bg-pink-50" },
  "Beauty":                 { Component: BeautyIcon,        containerClass: "bg-pink-50" },
  "Modest Fashion":         { Component: FashionIcon,       containerClass: "bg-stone-50" },
  "Fashion":                { Component: FashionIcon,       containerClass: "bg-stone-50" },
  "Food & Groceries":       { Component: FoodIcon,          containerClass: "bg-red-50" },
  "Food & Drinks":          { Component: FoodIcon,          containerClass: "bg-red-50" },
  "Crafts":                 { Component: CraftsIcon,        containerClass: "bg-orange-50" },
  "Other":                  { Component: OtherIcon,         containerClass: "bg-violet-50" },
};

export function iconFor(name?: string | null): CategoryIconConfig {
  if (!name) return CATEGORY_ICON["Other"];
  return CATEGORY_ICON[name] ?? CATEGORY_ICON["Other"];
}

export type { CategoryIconConfig as CategoryIcon };
