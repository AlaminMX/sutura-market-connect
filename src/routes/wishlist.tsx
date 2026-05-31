/**
 * wishlist.tsx — /wishlist
 * Shows all products the user has saved (via the heart button on ProductCard).
 * Data is stored in localStorage — no auth required.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ProductCard, getWishlist } from "@/components/ProductCard";
import { BackButton } from "@/components/BackButton";
import { ProductSkeleton } from "@/components/LoadingSpinner";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const [ids, setIds] = useState<string[]>([]);

  // Hydrate IDs from localStorage on mount
  useEffect(() => {
    setIds(getWishlist());

    // Listen for changes (e.g. if user opens another tab)
    const onStorage = () => setIds(getWishlist());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const { data: products, isLoading } = useQuery({
    queryKey: ["wishlist-products", ids],
    enabled: ids.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, stock_status, seller_id, sellers(business_name, city, slug, whatsapp_number)")
        .in("id", ids);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="mx-auto max-w-5xl px-5 py-8">
        <BackButton fallback="/" />

        <div className="mt-4 flex items-center gap-3">
          <Heart className="h-6 w-6 fill-rose-400 text-rose-400" />
          <div>
            <h1 className="font-serif text-3xl">Saved Products</h1>
            <p className="text-xs text-muted-foreground">Kayan da aka ajiye</p>
          </div>
        </div>

        {ids.length === 0 ? (
          /* Empty state */
          <div className="mt-20 flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="font-serif text-2xl">Nothing saved yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/">
              <Button className="mt-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-3 text-sm text-muted-foreground">
              {ids.length} saved item{ids.length !== 1 ? "s" : ""}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {isLoading
                ? Array.from({ length: ids.length }).map((_, i) => <ProductSkeleton key={i} />)
                : products?.map((p, i) => {
                    const s = (p as any).sellers;
                    return (
                      <div key={p.id} className="card-enter" style={{ animationDelay: `${i * 0.05}s` }}>
                        <ProductCard
                          id={p.id}
                          name={p.name}
                          price={Number(p.price)}
                          image_url={p.image_url}
                          stock_status={p.stock_status}
                          seller_id={p.seller_id}
                          seller_name={s?.business_name}
                          seller_city={s?.city}
                          seller_slug={s?.slug}
                          whatsapp_number={s?.whatsapp_number ?? ""}
                        />
                      </div>
                    );
                  })}
            </div>
          </>
        )}
      </div>
      <Footer />

      <style>{`
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: card-enter 0.35s ease both; }
      `}</style>
    </div>
  );
}
