/**
 * dashboard.tsx
 * Redirects authenticated sellers to their store page.
 * FIX: Uses getSession() (reads localStorage instantly) instead of getUser()
 * (which makes a server-side network request and could hang/fail on refresh,
 * causing the infinite loading spinner).
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
      // FIX: getSession reads localStorage instantly — no network hang
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        nav({ to: "/auth" });
        return;
      }

      const uid = sessionData.session.user.id;
      const { data: s } = await supabase
        .from("sellers")
        .select("slug")
        .eq("user_id", uid)
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
