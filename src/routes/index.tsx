/**
 * Homepage — Editorial Marketplace Bento.
 * Locked palette: terracotta + sage on warm bone. Type: DM Serif Display + Fira Sans.
 * Data hooks unchanged from prior version; only composition/visual layer rebuilt.
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/LoadingSpinner";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, Store } from "lucide-react";
import { ExploreCities } from "@/components/ExploreCities";
import { useCity } from "@/lib/cityContext";

export const Route = createFileRoute("/")({ component: Index });

const PLACEHOLDER_PRODUCTS = [
  { name: "Hand-dyed Atampa",  price: 12500, seller: "Hajiya's Couture",   city: "Kano",     emoji: "🧵" },
  { name: "Yaji Spice Blend",  price: 2800,  seller: "Borno Fragrances",   city: "Maiduguri", emoji: "🌶️" },
  { name: "Traditional Rug",   price: 45000, seller: "Zaria Leatherworks", city: "Kaduna",   emoji: "🪵" },
  { name: "Shea Body Butter",  price: 3000,  seller: "Fati Glow Beauty",   city: "Abuja",    emoji: "🌸" },
];

function useSection(sections: any[] | undefined, key: string) {
  return sections?.find((s: any) => s.key === key && s.is_visible !== false);
}

function Index() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const { selectedCity: city, setSelectedCity: _setCity } = useCity();

  const { data: sections } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: async () => {
      const { data } = await supabase
        .from("homepage_sections").select("*")
        .eq("is_visible", true).order("sort_order")
        .abortSignal(AbortSignal.timeout(8000));
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000, retry: 1,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order")
        .abortSignal(AbortSignal.timeout(8000));
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000, retry: 1,
  });

  const { data: cityRows } = useQuery({
    queryKey: ["home-cities"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cities_with_stats")
        .select("id, name, state, slug, sellers_count, products_count, is_active, sort_order")
        .eq("is_active", true).order("sort_order").limit(2);
      if (error) {
        const { data: fallback } = await supabase.from("cities_of_business")
          .select("id, name, state, slug").eq("is_active", true).order("sort_order").limit(2);
        return fallback ?? [];
      }
      return data ?? [];
    },
  });

  const { data: topSellers } = useQuery({
    queryKey: ["top-sellers-bento", city],
    queryFn: async () => {
      let qb = supabase.from("sellers")
        .select("id, slug, business_name, category, city, profile_photo_url, is_verified, rating")
        .eq("is_blocked", false).eq("verification_status", "approved")
        .order("is_verified", { ascending: false })
        .order("rating", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }).limit(4);
      if (city !== "All") qb = qb.eq("city", city);
      const { data, error } = await qb.abortSignal(AbortSignal.timeout(8000));
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000, retry: 1,
  });

  const { data: sellerCount } = useQuery({
    queryKey: ["seller-count"],
    queryFn: async () => {
      const { count } = await supabase.from("sellers")
        .select("id", { count: "exact", head: true })
        .eq("is_blocked", false).eq("verification_status", "approved");
      return count ?? 0;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["featured-products-bento", city],
    queryFn: async () => {
      const buildFeatured = () => {
        let qb = supabase.from("products")
          .select("id, name, price, image_url, stock_status, is_featured, featured_order, status, seller_id, sellers!inner(business_name, city, slug, whatsapp_number, is_blocked, verification_status)")
          .eq("is_featured", true).eq("status", "active")
          .eq("sellers.is_blocked", false).eq("sellers.verification_status", "approved")
          .order("featured_order").limit(8);
        if (city !== "All") qb = qb.eq("sellers.city", city);
        return qb.abortSignal(AbortSignal.timeout(8000));
      };
      const buildRecent = () => {
        let qb = supabase.from("products")
          .select("id, name, price, image_url, stock_status, status, seller_id, sellers!inner(business_name, city, slug, whatsapp_number, is_blocked, verification_status)")
          .eq("status", "active").eq("sellers.is_blocked", false).eq("sellers.verification_status", "approved")
          .order("created_at", { ascending: false }).limit(8);
        if (city !== "All") qb = qb.eq("sellers.city", city);
        return qb.abortSignal(AbortSignal.timeout(8000));
      };
      const [f, r] = await Promise.all([buildFeatured(), buildRecent()]);
      if (f.data && f.data.length > 0) return f.data;
      if (r.error) throw r.error;
      return r.data ?? [];
    },
    staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000, retry: 1,
  });

  const heroSection = useSection(sections, "hero");
  const featuredSection = useSection(sections, "featured_products");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    nav({ to: "/search", search: { q: q.trim(), city: city !== "All" ? city : undefined } });
  };

  const hasProducts = (featuredProducts?.length ?? 0) > 0;
  const productsForBento = hasProducts ? featuredProducts!.slice(0, 2) : null;
  const productGridRest = hasProducts ? featuredProducts!.slice(2) : [];
  const topCats = (categories ?? []).slice(0, 4);
  const cityTiles = cityRows ?? [];

  return (
    <div className="min-h-screen bg-background">
      <WelcomeModal />
      <TopBar />

      {/* ── BENTO HERO ── */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-12 lg:pt-12">
        <div className="grid auto-rows-[160px] grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-12">

          {/* Hero search tile */}
          <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground md:col-span-4 md:row-span-3 lg:col-span-8 lg:row-span-3 lg:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#B04A2F] opacity-50 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #FCF9F5 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }} />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur">
                <Sparkles className="h-3 w-3" /> Arewa kasuwa · WhatsApp-first
              </div>
              <h1 className="font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
                {heroSection?.title ?? "Find the best of"} <br />
                <span className="italic opacity-90">{heroSection?.subtitle ?? "Arewa markets."}</span>
              </h1>
              <p className="mt-3 max-w-md text-sm text-primary-foreground/80 lg:text-base">
                {heroSection?.content ?? "Discover trusted local sellers — fashion, food, beauty, and craft from Northern Nigeria's best."}
              </p>
              <form
                onSubmit={submitSearch}
                className="relative mt-6 flex max-w-md items-center rounded-full border border-white/25 bg-white/10 p-1.5 backdrop-blur-md"
              >
                <Search className="ml-3 h-4 w-4 shrink-0 text-white/70" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search Atampa, Shadda, suya, zobo…"
                  aria-label="Search products and sellers"
                  className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/55"
                />
                <Button
                  type="submit"
                  className="h-9 shrink-0 rounded-full bg-sage px-5 text-xs font-medium text-white hover:bg-sage-deep"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>

          {/* Top Sellers tile */}
          <div className="rounded-3xl border border-border-warm bg-card p-5 md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-espresso">Top sellers</h2>
              <Link to="/sellers" className="text-[10px] font-bold uppercase tracking-widest text-sage-deep hover:text-primary">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {(topSellers && topSellers.length > 0 ? topSellers : []).slice(0, 3).map((s, i) => (
                <Link
                  key={s.id}
                  to="/store/$slug"
                  params={{ slug: s.slug }}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className={`h-11 w-11 shrink-0 overflow-hidden rounded-full bg-surface-warm ring-2 ${
                      s.is_verified ? "ring-sage" : i === 0 ? "ring-primary" : "ring-border-warm"
                    }`}
                  >
                    {s.profile_photo_url ? (
                      <img src={s.profile_photo_url} alt={s.business_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-base text-primary">
                        {s.business_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold leading-tight text-espresso group-hover:text-primary">
                      {s.business_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.city}{s.is_verified ? " · Verified" : ""}{typeof s.rating === "number" ? ` · ${Number(s.rating).toFixed(1)} ★` : ""}
                    </p>
                  </div>
                </Link>
              ))}
              {(!topSellers || topSellers.length === 0) && (
                <p className="py-6 text-center text-xs text-muted-foreground">No verified sellers yet in {city}.</p>
              )}
            </div>
          </div>

          {/* Categories tile (sage) */}
          <div className="relative overflow-hidden rounded-3xl bg-sage p-5 text-white md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2">
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
            <h2 className="relative z-10 mb-3 font-display text-2xl">Categories</h2>
            <div className="relative z-10 grid grid-cols-2 gap-2">
              {topCats.length > 0
                ? topCats.map((c: any) => (
                    <Link
                      key={c.id}
                      to="/category/$slug"
                      params={{ slug: c.slug }}
                      className="rounded-xl bg-white/10 p-3 text-center text-sm font-medium transition hover:bg-white/20"
                    >
                      {c.name}
                    </Link>
                  ))
                : ["Textiles", "Food", "Beauty", "Craft"].map((n) => (
                    <div key={n} className="rounded-xl bg-white/10 p-3 text-center text-sm font-medium">
                      {n}
                    </div>
                  ))}
            </div>
          </div>

          {/* City tile #1 */}
          <Link
            to={cityTiles[0]?.slug ? "/city/$slug" : "/"}
            params={cityTiles[0]?.slug ? { slug: cityTiles[0].slug } : (undefined as any)}
            className="group flex flex-col justify-between rounded-3xl border border-border-warm bg-surface-warm p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-warm md:col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-2"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-deep">Region</p>
              <h3 className="mt-1 font-display text-3xl text-espresso">{cityTiles[0]?.name ?? "Kano City"}</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-sm text-muted-foreground">
                {cityTiles[0]?.state ?? "Explore the ancient hub of commerce and culture."}
              </p>
              <ArrowUpRight className="h-5 w-5 text-sage-deep transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* Featured product tiles */}
          {productsForBento && productsForBento[0] && (() => {
            const p: any = productsForBento[0];
            const seller = p.sellers;
            return (
              <Link
                to="/store/$slug"
                params={{ slug: seller?.slug ?? "" }}
                className="group flex flex-col rounded-3xl border border-border-warm bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-warm-lg md:col-span-2 md:row-span-3 lg:col-span-3 lg:row-span-3"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-surface-warm">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center italic text-primary/60">Product image</div>
                  )}
                </div>
                <h4 className="mt-4 line-clamp-1 font-semibold text-espresso">{p.name}</h4>
                <p className="mt-auto pt-2 font-display text-lg text-sage-deep">₦{Number(p.price).toLocaleString()}</p>
                <div className="mt-3 rounded-xl bg-espresso py-2 text-center text-xs font-medium text-background">
                  WhatsApp vendor
                </div>
              </Link>
            );
          })()}

          {productsForBento && productsForBento[1] && (() => {
            const p: any = productsForBento[1];
            const seller = p.sellers;
            return (
              <Link
                to="/store/$slug"
                params={{ slug: seller?.slug ?? "" }}
                className="group flex flex-col rounded-3xl border border-border-warm bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-warm-lg md:col-span-2 md:row-span-3 lg:col-span-3 lg:row-span-3"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-surface-warm">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center italic text-sage">Product image</div>
                  )}
                </div>
                <h4 className="mt-4 line-clamp-1 font-semibold text-espresso">{p.name}</h4>
                <p className="mt-auto pt-2 font-display text-lg text-sage-deep">₦{Number(p.price).toLocaleString()}</p>
                <div className="mt-3 rounded-xl bg-espresso py-2 text-center text-xs font-medium text-background">
                  WhatsApp vendor
                </div>
              </Link>
            );
          })()}

          {/* Placeholder bento product tiles when no real products */}
          {!productsForBento && (
            <>
              <div className="flex flex-col rounded-3xl border border-border-warm bg-card p-4 md:col-span-2 md:row-span-3 lg:col-span-3 lg:row-span-3">
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-warm text-5xl">🧵</div>
                <h4 className="mt-4 font-semibold text-espresso">Hand-dyed Atampa</h4>
                <p className="mt-auto pt-2 font-display text-lg text-sage-deep">₦12,500</p>
              </div>
              <div className="flex flex-col rounded-3xl border border-border-warm bg-card p-4 md:col-span-2 md:row-span-3 lg:col-span-3 lg:row-span-3">
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-warm text-5xl">🌶️</div>
                <h4 className="mt-4 font-semibold text-espresso">Yaji Spice Blend</h4>
                <p className="mt-auto pt-2 font-display text-lg text-sage-deep">₦2,800</p>
              </div>
            </>
          )}

          {/* Verified-sellers stat (espresso) */}
          <div className="flex items-center justify-center rounded-3xl bg-espresso p-5 text-background md:col-span-2 md:row-span-1 lg:col-span-3 lg:row-span-1">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-background/60">
                <ShieldCheck className="h-3 w-3" /> Verified sellers
              </p>
              <p className="mt-1 font-display text-3xl">{sellerCount ?? "—"}</p>
            </div>
          </div>

          {/* City tile #2 */}
          {cityTiles[1] ? (
            <Link
              to="/city/$slug"
              params={{ slug: cityTiles[1].slug }}
              className="group flex flex-col justify-between rounded-3xl border border-border-warm bg-surface-warm p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-warm md:col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-2"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-deep">{cityTiles[1].state ?? "Region"}</p>
                <h3 className="mt-1 font-display text-2xl text-espresso">{cityTiles[1].name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover artisanal goods from the heart of {cityTiles[1].name}.
              </p>
            </Link>
          ) : (
            <Link
              to="/register"
              className="group flex flex-col justify-between rounded-3xl border border-border-warm bg-surface-warm p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-warm md:col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-2"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sage-deep">For sellers</p>
                <h3 className="mt-1 font-display text-2xl text-espresso">Open your store</h3>
              </div>
              <p className="flex items-center gap-1 text-sm text-primary">
                <Store className="h-4 w-4" /> Fara kasuwanci →
              </p>
            </Link>
          )}
        </div>
      </section>

      {/* ── Explore cities (full grid) ── */}
      <ExploreCities />

      {/* ── Featured product grid (rest) ── */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage-deep">Just in</p>
            <h2 className="mt-1 font-display text-3xl text-espresso">
              {featuredSection?.title ?? "Featured products"}
            </h2>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-sage-deep hover:text-primary">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : productGridRest.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {productGridRest.map((p: any, i: number) => {
              const s = p.sellers;
              return (
                <div key={p.id} className="card-enter" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard
                    id={p.id} name={p.name} price={Number(p.price)}
                    image_url={p.image_url} stock_status={p.stock_status}
                    status={p.status} seller_id={p.seller_id}
                    seller_name={s?.business_name} seller_city={s?.city}
                    seller_slug={s?.slug} whatsapp_number={s?.whatsapp_number ?? ""}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {PLACEHOLDER_PRODUCTS.map((p, i) => (
              <div
                key={p.name}
                className="card-enter overflow-hidden rounded-3xl border border-border-warm bg-card p-3"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-warm text-5xl">{p.emoji}</div>
                <div className="px-1 pt-3">
                  <h4 className="line-clamp-1 font-medium text-espresso">{p.name}</h4>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.seller} · {p.city}</p>
                  <p className="mt-2 font-display text-lg text-sage-deep">₦{p.price.toLocaleString()}</p>
                  <div className="mt-3 rounded-full bg-muted px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                    Coming soon
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/products">
            <Button variant="outline" className="rounded-full border-border-warm bg-card hover:bg-surface-warm">
              Browse all products <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
          {productGridRest.length === 0 && !productsLoading && (
            <Link to="/register" className="text-xs font-medium text-primary underline underline-offset-4">
              Be the first to list real products.
            </Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
