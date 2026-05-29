# Sutura Market — UI/UX Refinement Plan

A focused pass across hero, navigation, categories, store page, onboarding and auth — keeping the warm, culturally-rooted, mobile-first direction.

## 1. Hero section

**File:** `src/routes/index.tsx`

- Generate a warm hero image with imagegen (golden-hour Northern Nigerian market — fabrics, food, smiling entrepreneurs) → save to `src/assets/hero-market.jpg`.
- Place it as a full-bleed background behind the headline with a dark warm gradient overlay (`from-black/55 via-black/30 to-background`) so text stays readable.
- Adjust hero text colors to read on the photo (white/cream headline, soft cream body); keep the floating orbs but lower opacity.
- Replace the text-link "Fara Kasuwanci — List Your Business" with a proper primary CTA button:
  - Rounded-full, solid primary background, white text, `shadow-warm-lg`, scale-on-press, large tap target (`py-6 px-8 text-base font-medium`).
  - Label: **"Open Your Store · Fara Kasuwanci"**.
  - Sits below the search bar, visually anchored.
- Add a secondary ghost link "Browse the market" that scrolls to `#categories`.

## 2. Remove language toggle

**File:** `src/components/TopBar.tsx`

- Delete the EN/HA pill toggle and the `useLang` import.
- Keep Hausa accents already present in copy (category subtitles, hero `Kasuwa`, section taglines like *Zaɓi kasuwa*, *Sababbin masu sayarwa*). No code-level switching.
- Leave `src/lib/i18n.tsx` in place but unused (no further dependency on it); `CATEGORY_HAUSA` / `hausaFor` continue to drive subtitles.

## 3. Category icons

**Files:** `src/lib/categories.ts` (new icon map), `src/routes/index.tsx`, `src/routes/category.$slug.tsx`

- Build a `CATEGORY_ICON` map keyed by category slug/name → Lucide icon component + tint class:
  - Fashion → `Shirt` (rose tint), Food & Drinks → `UtensilsCrossed` (amber), Beauty → `Sparkles` (pink), Home / Home & Living → `Sofa` (terracotta), Crafts → `Palette` (clay), Services → `HandHelping` (sage), Other → `ShoppingBag` (muted).
- Render each category card with a filled colored badge (rounded-2xl, ~14×14, tinted background, white icon) instead of the raw emoji. Keep the name + Hausa subtitle.
- Add subtle hover lift + ring-on-hover so cards feel like clickable stalls.

## 4. Seller store page redesign

**File:** `src/routes/store.$slug.tsx`

- Larger immersive cover (`h-56 sm:h-72`) with a soft bottom gradient fade into the page background; placeholder gradient stays for sellers without a cover.
- Circular profile image enlarged (`h-28 w-28`), thicker ring, soft `shadow-warm-lg`, overlapping the cover by ~50%.
- Header block: business name (serif, large), verified badge inline, then city + category chips, then bio in muted serif.
- **Remove** the profile-completeness progress bar and percentage entirely (also remove the `completeness` calculation).
- Action row: primary "Share My Store" pill + "Vouch" pill (when applicable), evenly spaced.
- Product grid: consistent `aspect-square` tiles, rounded-2xl cards, two cols mobile / three desktop, image-first with name + bolded price below — no description clutter.
- Keep the sticky "Order on WhatsApp" CTA but tighten styling and ensure padding-bottom on page so it never overlaps the last row.

## 5. Password visibility toggle

**New file:** `src/components/ui/password-input.tsx`

- A `PasswordInput` wrapping shadcn `Input` with an inline `Eye` / `EyeOff` Lucide button on the right, `aria-label`, focus ring preserved.
- Use it in:
  - `src/routes/auth.tsx` (sign-in + sign-up password field).
  - Anywhere a password input is added later (no other password fields exist today).

## 6. Email verification flow

Currently `emailRedirectTo` lands on `/register` after Supabase appends a hash fragment, which the user perceives as a broken page when the session isn't yet set.

**Changes:**
- **New route** `src/routes/verified.tsx` — branded success page (Sutura logo, success check illustration, warm copy, "Continue to Sutura Market" CTA that routes to `/dashboard` if a seller exists, otherwise `/register`). Handles the Supabase hash tokens by calling `supabase.auth.getSession()` and showing a loading state until session is set, then enabling the CTA.
- Update `src/routes/auth.tsx` signup: `emailRedirectTo: ${origin}/verified`.

**New route** `src/routes/verify-email.tsx` — full-page reminder shown after sign-in attempt by an unverified user:
- Sutura logo, friendly illustration, explanation, "Resend verification email" button (calls `supabase.auth.resend`), "Back to login" link.
- Update `auth.tsx` sign-in path: if `data.user` exists but `email_confirmed_at` is null, redirect to `/verify-email?email=...` instead of toasting.

## 7. Registration — city dropdown

**File:** `src/routes/register.tsx` + `src/lib/categories.ts`

- Expand `NIGERIAN_CITIES` to the full Northern Nigerian list provided: Kano, Kaduna, Zaria, Sokoto, Katsina, Gusau, Birnin Kebbi, Bauchi, Gombe, Dutse, Minna, Ilorin, Jos, Yola, Jalingo, Maiduguri, Potiskum, Hadejia, Funtua, Azare, Kontagora, Lafia, Abuja + sorted alphabetically, with **"Other"** appended last.
- When `city === "Other"`, smoothly reveal a text input (`Input` with `mt-2`, autofocus) for the user to type their city. On submit, persist the typed value into `city`.

## 8. Misc polish

- Verify the homepage hero still works on small viewports (CTA stacks under search on mobile).
- Replace the registration final-step "Add Product" CTA wording with "Add my first product" for warmth.
- Keep all semantic design tokens; no raw hex colors in components.

## Files touched

```text
src/assets/hero-market.jpg            (new — generated)
src/components/TopBar.tsx              (remove lang toggle)
src/components/ui/password-input.tsx   (new)
src/lib/categories.ts                  (icon map + expanded cities)
src/routes/index.tsx                   (hero image, CTA, category icons)
src/routes/category.$slug.tsx          (category icon header)
src/routes/store.$slug.tsx             (redesign, remove completeness)
src/routes/auth.tsx                    (password toggle, verify redirects)
src/routes/register.tsx                (cities + Other field, copy)
src/routes/verified.tsx                (new — success page)
src/routes/verify-email.tsx            (new — reminder page)
```

No database or RLS changes required.
