
# Sutura Market — Full Rebuild (single mega-pass)

Palette stays as the current **Terracotta & Sage** (we don't switch to Earth Brown). Tokens already in `src/styles.css` map to spec roles:
- spec `--primary` → existing terracotta `#C05A3F`
- spec `--sage` → existing `#8A9A5B` (+ add `--sage-light: #B5C48A`)
- spec `--gold` → add `#C9A84C` for verified badges
- spec `--foreground` → existing espresso `#3E2723`
- spec `--background`/`--card`/`--border`/`--muted` already match warm bone palette
- spec `--destructive` already terracotta-deep; keep current

Everything in the uploaded spec ships in this one pass.

## 1. Database — new migration (one file)

- Add `products.price_updated_at TIMESTAMPTZ`; trigger `set_price_updated_at` updates it when `price` changes on UPDATE.
- Add `products.image_urls TEXT[] DEFAULT '{}'`. Keep existing `image_url` as primary.
- Add `products.is_featured BOOLEAN DEFAULT false` (+ index) and `products.featured_order INT`.
- Ensure `cities_of_business.is_active BOOLEAN DEFAULT true` (add if missing).
- `vouches`: ensure unique `(voucher_seller_id, vouched_seller_id)`; CHECK `voucher_seller_id <> vouched_seller_id`.
- Rewrite `check_vouch_verification` trigger: threshold **3** (was 5). Update `check_vouch_revocation` to threshold 3.
- `whatsapp_clicks`: ensure `product_id UUID NULL REFS products(id)`, `seller_id UUID NOT NULL REFS sellers(id)`, `created_at TIMESTAMPTZ DEFAULT now()`. Add index `(seller_id, created_at)` and `(product_id)`. Open INSERT to `anon`+`authenticated` (already; verify).
- WhatsApp NG number CHECK on `sellers.whatsapp_number` (`^0[789]\d{9}$`) — added as a NOT VALID constraint then VALIDATE so existing rows that fail are reported.
- `homepage_sections`: ensure `title_en`, `title_ha`, `subtitle_en`, `subtitle_ha`, `body_en`, `body_ha`, `sort_order`, `is_visible`, `key` columns (add missing).
- Add `admin_audit_log` insert policy for admins (already exists, verify).
- GRANTs verified for every touched public table.

No existing data shape broken; only additive.

## 2. Auth + session (already partly fixed)

`src/lib/authContext.tsx` is already correct (rehydrates via `getSession()`, sets `isReady` after). Keep as-is. Verify every protected screen gates on `isReady`.

`/auth` rewrite: tabbed Sign In / Register card, show/hide password, inline field errors + sonner toasts, post-login routing (admin → `/admin`, seller → `/store/:slug`, none → `/register`).

`/reset-password` rewrite: dual-mode (email request vs. recovery token landing with new+confirm fields). `/verify-email` kept.

`/register`: business name, city dropdown (active cities only), category dropdown, WhatsApp regex `^0[789]\d{9}$`, optional description + profile + cover upload to `sutura` bucket. On submit insert seller `verification_status: 'pending'`, then show "Under review" screen (no auto-redirect to store).

## 3. Bottom nav rebuild (`SellerBottomNav.tsx` → `BottomNav.tsx`)

Context-aware off `useAuth()` + a new `useSellerProfile()` hook (single shared query — fixes bug #14, no per-mount Supabase race).

- **Buyer** (no user, or user with no seller): Home / Explore / Wishlist (count badge from wishlist hook).
- **Seller** (approved or pending, not admin): Home / Explore / **+** floating / My Products / My Store. Floating button opens Add Product sheet (disabled with notice if not approved).
- **Admin**: Home / Admin / Sign Out.

Fixed, z-50, smooth 100ms, active tab `text-primary`. Add global `pb-20` via a `PageShell` wrapper used by every route.

## 4. Routes (file paths)

Existing — rebuild content:
- `index.tsx` — Hero + Categories strip (all from DB) + Top Sellers in City (4) + Featured Products grid + Explore Cities (4 tiles) + Trust banner.
- `sellers.tsx`, `category.$slug.tsx`, `city.$slug.tsx`, `wishlist.tsx`, `search.tsx`, `store.$slug.tsx`, `auth.tsx`, `register.tsx`, `reset-password.tsx`, `verify-email.tsx`, `account.tsx`, `admin.tsx`.

New routes to create:
- `src/routes/explore.tsx` — sticky search, trending sellers strip (7-day clicks), category quick filter, randomized products grid w/ "Load more", featured pins.
- `src/routes/product.$id.tsx` — image gallery, seller info row, description, stock, WhatsApp CTA (logs click), wishlist toggle, related products.
- `src/routes/seller.products.tsx` — seller-only management list: stats tiles, per-product edit/delete/stock toggle, click count, Edit Product sheet with **price lock** logic (`price_updated_at + 7d` rule, only on edits where prior price wasn't null).

Remove unused `dashboard.tsx` redirect or repoint it to `/store/:slug`.

## 5. Components to build / update

- `ProductCard.tsx` — image (1:1), name (truncate), price or "Price on request", seller link, city pill, wishlist heart (top-right, optimistic), out-of-stock overlay. Card click → `/product/$id`. Remove any WhatsApp button.
- `SellerCard.tsx` — circular avatar, name, city, category, gold verified check, vouch count.
- `WishlistHeart.tsx` — extracted; reads/writes localStorage; emits `window` event so nav badge updates live.
- `lib/wishlist.ts` — already exists; expose `useWishlist()` hook with subscribe API + total value selector.
- `CitySelector.tsx` — bottom sheet (drawer) bound to `cityContext`.
- `CategoryStrip.tsx`, `FeaturedGrid.tsx`, `TopSellersStrip.tsx`, `ExploreCities.tsx`, `TrustBanner.tsx`.
- `WhatsAppButton.tsx` — single source for `wa.me/234…` formatting + `whatsapp_clicks` insert (anonymous-allowed). Used by product detail, store page, wishlist items.
- `ImageGallery.tsx` — main + thumb strip; uses `image_urls` ∪ `image_url`.
- `MultiImageUploader.tsx` — up to 5 to `sutura` bucket; returns ordered URL array.
- `AddProductSheet.tsx` / `EditProductSheet.tsx` — shared sheet; edit enforces price lock; add allows null price.
- `BilingualLabel.tsx` — small helper rendering EN + muted Hausa sublabel (table from spec §18 hardcoded in `lib/i18n.tsx`).
- `Footer.tsx` — restyled per §23 (hide on `/auth`, `/register`, `/admin`).
- `BackButton.tsx` — already exists; add to every page except `/`.
- `PageShell.tsx` — wraps TopBar + content (pb-20) + Footer toggle.
- `VouchButton.tsx` — visible only to verified sellers viewing another store; one-shot insert.
- `SectionError.tsx` + `Skeleton` variants — already partial; standardize.

## 6. Admin overhaul (`/admin`)

Tabs (8): Overview · Sellers · Categories · Cities · Products · Vouches · WhatsApp Clicks · Homepage Sections.

All actions via existing `src/lib/admin.functions.ts` (extend with: `setProductFeatured`, `reorderFeatured`, `blockProduct`, `upsertCity`, `setCityActive`, `upsertCategory`, `deleteCategory`, `upsertHomepageSection`, `reorderHomepageSection`, `removeVouch`). All `createServerFn` + `requireSupabaseAuth` + `has_role(admin)` check inside.

Featured: cap 8 enforced in handler.

## 7. WhatsApp + telemetry

`lib/whatsapp.ts` already exists — extend: `buildLink({ phone, message })`, `logClick({ sellerId, productId })`. Support number hardcoded `07083958881`.

## 8. Performance + mobile pass

- Add `.abortSignal(AbortSignal.timeout(8000))` to every Supabase call (codemod across `src/lib/*.functions.ts` and components).
- `loading="lazy"` on all non-LCP `<img>`.
- Skeletons everywhere (replace spinners except first paint).
- 44px min hit targets via Tailwind utility class `min-h-[44px]`.
- 375px-no-overflow check via Playwright.

## 9. Verification (final step)

Playwright run against `http://localhost:8080`:
1. Restore Supabase session, refresh `/` → still logged in.
2. Navigate admin → seller → buyer paths; assert bottom nav variants.
3. `/product/$id` → tap WhatsApp → assert click row in `whatsapp_clicks` (psql SELECT).
4. Toggle wishlist heart on a card → assert nav badge increments without navigation.
5. Add product without price → succeeds. Edit price < 7 days later → field disabled.
6. Admin grants `is_verified`; revokes; auto-grants at 3 vouches (insert 3 vouches via SQL).
7. Screenshots Home/Explore/Product/Wishlist/Store/Admin at 1280 and 390.
8. Console errors = 0.

## What I will NOT change
- `src/integrations/supabase/*` (auto-generated).
- Existing migrations.
- `src/lib/authContext.tsx` (already correct).
- Tech stack, routes naming convention, RLS posture beyond the additions above.

## Order of execution

1. Run the migration (one file). Wait for approval.
2. Wire shared infra: `useSellerProfile`, `useWishlist`, `BottomNav`, `PageShell`, `Footer`, `WhatsAppButton`, `BilingualLabel`, `ImageGallery`, `MultiImageUploader`.
3. Rebuild components: `ProductCard`, `SellerCard`, `CategoryStrip`, `TopSellersStrip`, `ExploreCities`, `TrustBanner`, `CitySelector`.
4. New routes: `explore.tsx`, `product.$id.tsx`, `seller.products.tsx`. Sheets: Add/Edit Product, Vouch.
5. Rebuild pages: `index`, `sellers`, `search`, `wishlist`, `store.$slug`, `category.$slug`, `city.$slug`, `auth`, `register`, `reset-password`, `account`.
6. Admin rebuild (8 tabs) + server functions extension.
7. Codemod abort signals, lazy images, skeletons.
8. Playwright verification + screenshot review.

Approve and I'll start with the migration.
