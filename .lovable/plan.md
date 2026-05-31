
# Sutura Market — Localization, Verification, Wishlist, Admin & Media Plan (v2)

This plan covers Parts 1–9 of the original brief plus the 6 revisions. It builds on the existing moderation system (sellers.status, seller_notices, admin_audit_log) without breaking it.

---

## Part 1 — Cities of Business

**New table `cities_of_business`**
- `id`, `name`, `state`, `slug` (unique, URL-safe), `is_active` (default true), `sort_order`, timestamps
- RLS: public SELECT where `is_active = true` OR admin; admin full write
- Seeded with: Kaduna, Kano, Bauchi, Abuja, Sokoto (admin can add more, none hardcoded in app code)

**`sellers` table**
- Add `city_id uuid REFERENCES cities_of_business(id)`
- Keep legacy `city text` for one release; backfill `city_id` by matching name; new registrations require `city_id`
- Admin can edit `city_id` on any seller

**Seller registration**
- Required dropdown sourced from active cities, label "City of Business" with helper text from brief
- Block submit if empty

**Admin Cities tab (new in `/admin`)**
- Add / edit / rename / enable / disable / delete (guard: refuse delete if sellers reference it; suggest disable)
- Drag-to-reorder via `sort_order`
- **City analytics columns (Change 2)**: per-row `sellers_count`, `products_count`, `sellers_added_30d`, `products_added_30d`. Sort by any column; growth arrows highlight fastest-growing and underperforming cities. Stats come from a `cities_with_stats` SQL view (LEFT JOIN sellers + products, GROUP BY city) so they auto-update on every read. No materialized view — view is cheap at our scale and always fresh.
- All actions via `cities.functions.ts` + `assertAdmin` + audit log

---

## Part 2 — Marketplace Localization

**User city preference**
- Guest: `localStorage` (`sutura.preferred_city_slug`)
- Logged-in: `profiles.preferred_city_id` (profiles table created in Part 3)
- `useCityPreference()` hook: logged-in pref wins, falls back to localStorage, syncs on login

**First-time prompt**
- Lightweight dismissible sheet on first visit: "📍 Select your city to see products available near you" — lists active cities, never blocks browsing

**Header**
- TopBar: "📍 Your Marketplace: {City}" with click-to-switch popover + "Show all cities" escape hatch

**Filtering**
- Homepage, `/sellers`, `/category/$slug`, `/search`, featured, recommendations all filter by `sellers.city_id = preferredCityId`
- Switching invalidates TanStack Query caches

---

## Part 2b — Dedicated City Marketplace Pages (Change 3)

**New route `/city/$slug`**
- Self-contained marketplace: hero with city name + state, featured products (city-scoped), category grid (only categories with active products in that city), seller grid, all products listing
- Loader: looks up city by slug → 404 if inactive/missing → fetches city-scoped data via public server fn
- Sub-routes: `/city/$slug/sellers`, `/city/$slug/category/$catSlug` (optional, reuse existing components with city filter)

**SEO (Change 6)**
- `head()` per route: title `"{City} Marketplace — Sutura"`, description `"Discover sellers and products in {City}, {State}. Shop locally on Sutura."`, og:title, og:description, og:url, canonical (leaf only)
- JSON-LD: `@type: "Marketplace"` + `BreadcrumbList`; per-product on store/product pages already covered
- Sitemap: extend `src/routes/sitemap[.]xml.ts` to enumerate every active city → `/city/{slug}`
- Slugs are URL-safe (kebab-case, no diacritics)

---

## Part 2c — Homepage "Explore by City" (Change 4)

- New homepage section rendered from `cities_of_business WHERE is_active` ordered by `sort_order`
- Card per city showing name, state, seller count (from `cities_with_stats` view), optional icon
- Click → `/city/{slug}`
- Zero hardcoded city names

---

## Part 3 — User Accounts & Wishlist

**New tables**
- `profiles`: `user_id` PK, `display_name`, `preferred_city_id`, timestamps; RLS owner-only; auto-created via extended `handle_new_user` trigger
- `wishlists`: `user_id`, `product_id`, `created_at`, PK(user_id, product_id); RLS owner-only
- `recently_viewed`: `user_id`, `product_id`, `viewed_at`; RLS owner-only; capped at 50/user via trigger

**UI**
- Heart icon on `ProductCard` — guests get auth modal with value message: "Create a free account to save products, follow sellers, and get recommendations from your city."
- New `/account` route: Profile (name, preferred city), Wishlist, Recently Viewed
- One-time migration of any existing localStorage wishlist on first login

---

## Part 4 — Admin Seller Visibility & Edit

**Admin seller detail drawer**
- Every column: name, business_name, whatsapp, email (joined from `auth.users` via server fn), city, state, profile/cover, verification docs, dates, subscription, status, verification_status
- Inline edit for every field via `adminUpdateSeller` (uses `supabaseAdmin`, audited)

---

## Part 5 — Order/Lead Management

- Extend admin "Leads" tab over `whatsapp_clicks` joined with seller name, business_name, city, state, product
- True `orders` table out of scope unless requested

---

## Part 6 — Admin Governance

Covered by: existing admin panel + Cities tab + seller detail drawer + verification queue. Every admin action audited.

---

## Part 7 — Service Role for Moderation

**Audit**: `SUPABASE_SERVICE_ROLE_KEY` already configured; `admin.functions.ts` already uses `supabaseAdmin`. Real gaps:
- `deleteSeller` doesn't remove the `auth.users` row → call `supabaseAdmin.auth.admin.deleteUser(seller.user_id)` after cascading deletes
- Add `adminDeleteUser` server fn
- Extend cascades to `profiles`, `wishlists`, `recently_viewed`
- Confirm block/suspend/notice paths execute end-to-end

No env changes. Service-role key stays exclusively in `client.server.ts` (server-only import).

---

## Part 8 — Seller Verification Workflow (Revised — Change 1)

**`sellers` additions**
- `verification_status` text: `pending | approved | rejected | suspended` (default `pending`)
- `verification_decided_at`, `verification_decided_by`, `rejection_reason`
- `verification_documents jsonb` (array of `{url, label, uploaded_at}`)

**RLS tightening**
- `sellers_public_read` and `products_public_read` require `status='active' AND verification_status='approved'`
- Owner + admin still see their own
- **Hard server-side block**: trigger on `products` rejects INSERT/UPDATE when the owning seller's `verification_status != 'approved'` (admins bypass via `has_role`). This is the gate — UI disablement alone is not enough.

**Registration flow**
- Submit → confirmation screen: "Your application has been submitted… review… notified once approved."
- New sellers default to `pending`

**Pending seller dashboard (revised)**
Pending sellers CAN: log in, view profile, edit profile fields, upload verification documents, mark notices as read, respond to admin requests.
Pending sellers CANNOT: see/access product creation UI, edit existing products, publish, view product management tools (entire products section hidden behind verification gate).

Prominent banner: 🟡 **Verification Pending** — "Your store is currently under review. Product creation will become available after approval."

The Products tab in `/dashboard` is replaced (for pending sellers) with a verification-status panel + document upload + activity log. No empty product table, no disabled "New product" button that hints at the feature — the section simply isn't there until approval.

**Admin Verification Queue (new tab in `/admin`)**
- Default filter: pending
- Per-row: all seller data + document previews
- Actions: Approve / Reject (with reason) / Request changes (sends notice) / Suspend
- Filterable by status; sortable by submission date

**Approval / Rejection**
- Approve → status flips to `approved`, critical-severity notice created, audit entry; seller dashboard reveals product tools + shows "🟢 Your store has been approved and is now live."
- Reject → banner "🔴 Verification Rejected" + admin reason + "Resubmit" button (resets to `pending`, clears reason)

---

## Part 8b — Existing Seller Migration Review (Change 5)

**Migration strategy**
- Add `verification_status` column with default `pending`
- Backfill ALL existing sellers to `pending` (safe default — Option B as baseline)
- Then surface them in a dedicated **"Migration Review"** sub-tab of the Verification Queue

**Migration Review UI**
- One row per pre-existing seller with checkbox + all key fields + document presence indicator
- Toolbar: **Bulk Approve · Bulk Reject · Bulk Suspend** (select-all + per-row select)
- Bulk actions go through `bulkSetVerification` server fn — one audit entry per affected seller, single critical notice per seller
- Once a seller is decided, they leave the migration sub-tab and merge into the normal queue

This prevents accidental approval of test/duplicate/incomplete accounts and gives admins explicit control. Admins who want Option A can use "Select all → Bulk Approve" in one click.

---

## Part 9 — Reusable Image Upload + Media Viewer

**One `<ImageUploader>` component**
- Props: `aspect` ('square'|'circle'|'banner'|'product'|number), `onUploaded(url)`, `bucket`, `pathPrefix`, `maxSizeMb`
- Pipeline: pick → crop/zoom/drag modal (`react-easy-crop`) → canvas resize+compress (`browser-image-compression`) → upload to `sutura` bucket → return URL
- Single optimized JPEG/WebP, ~1600px long edge, ~85% quality
- Replaces ad-hoc uploads in seller registration, dashboard profile/cover, product create/edit, verification docs, category images

**One `<MediaViewer>` component**
- Full-screen lightbox: zoom, fade, close (Esc/X), swipe (mobile), arrow keys + buttons (desktop)
- Optional caption (product name + description below image)
- Thumbnail strip when >1 image
- Used everywhere images appear

**Storage**
- Reuse public `sutura` bucket; new prefix `verification-docs/` is private — only owner + admin can read via signed URL from server fn

---

## Database Summary

**New tables**: `cities_of_business`, `profiles`, `wishlists`, `recently_viewed`
**New view**: `cities_with_stats` (sellers + products counts, 30-day deltas)
**Updated tables**: `sellers` (+ `city_id`, `verification_status`, `verification_decided_at`, `verification_decided_by`, `rejection_reason`, `verification_documents`)
**RLS changes**: public-read on sellers/products requires `approved`; product write blocked by trigger when seller not approved
**New triggers**: `block_unapproved_product_writes`, `cap_recently_viewed_50`

## Server Functions (new/extended)

- `src/lib/cities.functions.ts` — list, CRUD, reorder, stats
- `src/lib/account.functions.ts` — profile, wishlist, recently viewed, set preferred city
- `src/lib/verification.functions.ts` — approve, reject, suspend, request-changes, resubmit, `bulkSetVerification`
- `src/lib/city-marketplace.functions.ts` — public city-scoped data fetchers
- Extend `src/lib/admin.functions.ts` — `adminUpdateSeller`, `adminDeleteUser`, cascade fixes

## New Routes

- `/account` (authenticated)
- `/city/$slug` (public, SEO-optimized, in sitemap)
- Admin `/admin` gains tabs: **Cities** (with stats), **Verification** (Pending / Migration Review / All)

## New Components

`ImageUploader`, `MediaViewer`, `CitySwitcher`, `CityPickerModal`, `CityCard`, `ExploreCitiesSection`, `VerificationBanner`, `VerificationQueueTable`, `MigrationReviewTable`, `BulkActionBar`, `AdminSellerDrawer`, `CityStatsTable`, `WishlistButton`.

## Dependencies

Add: `react-easy-crop`, `browser-image-compression`.

## Security

- All admin writes: server fn + `assertAdmin` + `supabaseAdmin` + audit log
- Service role key only in `client.server.ts`
- RLS denies non-approved sellers/products to public
- Wishlist/profiles/recently_viewed scoped to `auth.uid()`
- Product-write trigger enforces verification at DB level (defense in depth beyond UI hiding)
- Verification documents private, served via signed URLs

## Backward Compatibility

- `sellers.city` retained one release; reads prefer `city_id`
- Existing sellers → `verification_status='pending'` then routed through Migration Review (no silent auto-approval)
- localStorage wishlist migrated on first login

## Verification Checklist (post-build)

City CRUD, city analytics accuracy, `/city/$slug` page renders + SEO tags present + sitemap entry, "Explore by City" homepage section dynamic, city switching, guest→login wishlist migration, admin seller edit, admin user delete cascade, verification queue approve/reject/suspend/resubmit, **pending sellers cannot reach product creation UI or DB**, migration review bulk actions, banners visible, image crop/zoom on every upload, lightbox swipe/keyboard, no service-role key in client bundle.

## Out of Scope (call out for future)

True multi-item orders/cart, email/WhatsApp notifications on approval, pg_cron for subscription expiry, cross-city search.
