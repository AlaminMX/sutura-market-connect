import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let didRedirect = false;

    const redirect = async (userId: string) => {
      if (didRedirect || !isMounted) return;
      didRedirect = true;
      const { data: s } = await supabase
        .from("sellers").select("slug").eq("user_id", userId).maybeSingle();
      if (!isMounted) return;
      nav({ to: s ? "/store/$slug" : "/register", params: s ? { slug: s.slug } : undefined, replace: true });
    };

    // Instant check from localStorage (no network, no lock wait)
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session?.user) redirect(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT" || (!session && event === "INITIAL_SESSION")) {
        nav({ to: "/auth", replace: true });
        return;
      }
      if (session?.user && !didRedirect) redirect(session.user.id);
    });

    // Fallback: if nothing resolves in 5 s, go to auth
    const fallback = setTimeout(() => {
      if (!didRedirect && isMounted) nav({ to: "/auth", replace: true });
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(fallback);
      listener.subscription.unsubscribe();
    };
  }, [nav]);

  return <PageLoader label="Loading your store…" />;
}
