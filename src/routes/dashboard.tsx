/**
 * dashboard.tsx
 * The seller dashboard is now unified with the store page (store.$slug.tsx).
 * This route redirects authenticated sellers to their store page, and
 * non-sellers to /register.  Old bookmarks to /dashboard continue to work.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      // FIX: use getSession() (localStorage, instant) instead of getUser() (network call)
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) { nav({ to: "/auth" }); return; }

      const { data: s } = await supabase
        .from("sellers")
        .select("slug")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!s) {
        nav({ to: "/register" });
      } else {
        nav({ to: "/store/$slug", params: { slug: s.slug }, replace: true });
      }
    })();
  }, [nav]);

  return <PageLoader label="Loading your store…" />;
}
