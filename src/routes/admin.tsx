/**
 * admin.tsx
 * Full-featured admin panel:
 *   1. Overview stats
 *   2. Seller verification management
 *   3. Category management (create, edit, rename, reorder, delete)
 *   4. Featured products management (add, remove, reorder)
 *   5. Homepage sections management (edit text, show/hide, reorder)
 */

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  BadgeCheck, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Star, StarOff, Eye, EyeOff, Loader2, GripVertical,
} from "lucide-react";
import { PageLoader } from "@/components/LoadingSpinner";

export const Route = createFileRoute("/admin")({ component: AdminPage });

interface SellerRow { id: string; business_name: string; slug: string; category: string; city: string; is_verified: boolean; }
interface Category   { id: string; name: string; slug: string; icon_emoji: string; sort_order: number; }
interface ProductRow { id: string; name: string; price: number; image_url: string | null; is_featured: boolean; featured_order: number; sellers: { business_name: string; city: string } | null; }
interface Section    { id: string; key: string; title: string; subtitle: string | null; content: string | null; sort_order: number; is_visible: boolean; }

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

function AdminPage() {
  const nav = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const [sellers,   setSellers]   = useState<SellerRow[]>([]);
  const [categories,setCategories] = useState<Category[]>([]);
  const [products,  setProducts]   = useState<ProductRow[]>([]);
  const [sections,  setSections]   = useState<Section[]>([]);
  const [stats,     setStats]      = useState({ sellers: 0, products: 0, clicks: 0 });
  const [activeTab, setActiveTab]  = useState<"sellers"|"categories"|"featured"|"homepage">("sellers");

  // Category editor state
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName,    setCatName]    = useState("");
  const [catEmoji,   setCatEmoji]   = useState("🛍️");
  const [catSaving,  setCatSaving]  = useState(false);
  const [newCatOpen, setNewCatOpen] = useState(false);

  // Section editor state
  const [editingSec,  setEditingSec]  = useState<Section | null>(null);
  const [secTitle,    setSecTitle]    = useState("");
  const [secSubtitle, setSecSubtitle] = useState("");
  const [secContent,  setSecContent]  = useState("");
  const [secSaving,   setSecSaving]   = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) { nav({ to: "/auth" }); return; }
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      if (!role) { nav({ to: "/" }); return; }
      setAllowed(true);
      await loadAll();
    })();
  }, [nav]);

  const loadAll = async () => {
    const [{ data: sl }, { count: pc }, { count: cc }, { data: cats }, { data: prods }, { data: secs }] = await Promise.all([
      supabase.from("sellers").select("id, business_name, slug, category, city, is_verified").order("created_at", { ascending: false }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("whatsapp_clicks").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("id, name, price, image_url, is_featured, featured_order, sellers(business_name, city)").order("is_featured", { ascending: false }).order("featured_order").limit(100),
      supabase.from("homepage_sections").select("*").order("sort_order"),
    ]);
    setSellers(sl ?? []);
    setCategories(cats ?? []);
    setProducts((prods ?? []) as any);
    setSections(secs ?? []);
    setStats({ sellers: sl?.length ?? 0, products: pc ?? 0, clicks: cc ?? 0 });
  };

  // ── Seller verification ──
  const toggleVerify = async (id: string, current: boolean) => {
    const { error } = await supabase.from("sellers").update({ is_verified: !current }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setSellers((prev) => prev.map((s) => s.id === id ? { ...s, is_verified: !current } : s));
    toast.success(!current ? "Verified" : "Unverified");
  };

  // ── Categories ──
  const openNewCat = () => { setCatName(""); setCatEmoji("🛍️"); setEditingCat(null); setNewCatOpen(true); };
  const openEditCat = (c: Category) => { setCatName(c.name); setCatEmoji(c.icon_emoji); setEditingCat(c); setNewCatOpen(true); };

  const saveCat = async () => {
    if (!catName.trim()) { toast.error("Category name required"); return; }
    setCatSaving(true);
    if (editingCat) {
      const { error } = await supabase.from("categories").update({ name: catName.trim(), icon_emoji: catEmoji }).eq("id", editingCat.id);
      if (error) { toast.error(error.message); setCatSaving(false); return; }
      toast.success("Category updated");
    } else {
      const newSlug = slugify(catName);
      const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order));
      const { error } = await supabase.from("categories").insert({ name: catName.trim(), slug: newSlug, icon_emoji: catEmoji, sort_order: maxOrder + 1 });
      if (error) { toast.error(error.message); setCatSaving(false); return; }
      toast.success("Category created");
    }
    setCatSaving(false); setNewCatOpen(false); await loadAll();
  };

  const deleteCat = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Sellers using it won't be affected.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Category deleted"); setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const moveCat = async (id: string, dir: "up" | "down") => {
    const idx = categories.findIndex((c) => c.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const updated = [...categories];
    [updated[idx].sort_order, updated[swapIdx].sort_order] = [updated[swapIdx].sort_order, updated[idx].sort_order];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setCategories([...updated]);
    await Promise.all([
      supabase.from("categories").update({ sort_order: updated[idx].sort_order }).eq("id", updated[idx].id),
      supabase.from("categories").update({ sort_order: updated[swapIdx].sort_order }).eq("id", updated[swapIdx].id),
    ]);
  };

  // ── Featured products ──
  const toggleFeatured = async (p: ProductRow) => {
    const maxOrder = Math.max(0, ...products.filter((x) => x.is_featured).map((x) => x.featured_order));
    const updates = p.is_featured
      ? { is_featured: false, featured_order: 0 }
      : { is_featured: true,  featured_order: maxOrder + 1 };
    const { error } = await supabase.from("products").update(updates).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, ...updates } : x).sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.featured_order - b.featured_order;
    }));
    toast.success(p.is_featured ? "Removed from featured" : "Added to featured ⭐");
  };

  const moveFeatured = async (id: string, dir: "up" | "down") => {
    const feat = products.filter((p) => p.is_featured).sort((a, b) => a.featured_order - b.featured_order);
    const idx = feat.findIndex((p) => p.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= feat.length) return;
    const [a, b] = [feat[idx], feat[swapIdx]];
    const temp = a.featured_order;
    await Promise.all([
      supabase.from("products").update({ featured_order: b.featured_order }).eq("id", a.id),
      supabase.from("products").update({ featured_order: temp }).eq("id", b.id),
    ]);
    await loadAll();
  };

  // ── Homepage sections ──
  const openEditSection = (s: Section) => {
    setEditingSec(s); setSecTitle(s.title); setSecSubtitle(s.subtitle ?? ""); setSecContent(s.content ?? "");
  };

  const saveSection = async () => {
    if (!editingSec) return;
    setSecSaving(true);
    const { error } = await supabase.from("homepage_sections").update({
      title: secTitle.trim(), subtitle: secSubtitle.trim() || null, content: secContent.trim() || null,
    }).eq("id", editingSec.id);
    setSecSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Section updated");
    setSections((prev) => prev.map((s) => s.id === editingSec.id ? { ...s, title: secTitle, subtitle: secSubtitle, content: secContent } : s));
    setEditingSec(null);
  };

  const toggleSectionVisible = async (s: Section) => {
    const { error } = await supabase.from("homepage_sections").update({ is_visible: !s.is_visible }).eq("id", s.id);
    if (error) { toast.error(error.message); return; }
    setSections((prev) => prev.map((x) => x.id === s.id ? { ...x, is_visible: !s.is_visible } : x));
    toast.success(s.is_visible ? "Section hidden" : "Section shown");
  };

  const moveSec = async (id: string, dir: "up" | "down") => {
    const idx = sections.findIndex((s) => s.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;
    const updated = [...sections];
    [updated[idx].sort_order, updated[swapIdx].sort_order] = [updated[swapIdx].sort_order, updated[idx].sort_order];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    setSections([...updated]);
    await Promise.all([
      supabase.from("homepage_sections").update({ sort_order: updated[idx].sort_order }).eq("id", updated[idx].id),
      supabase.from("homepage_sections").update({ sort_order: updated[swapIdx].sort_order }).eq("id", updated[swapIdx].id),
    ]);
  };

  if (allowed === null) return <PageLoader label="Loading admin…" />;

  const tabCls = (t: typeof activeTab) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${activeTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`;

  const featuredProducts = products.filter((p) => p.is_featured).sort((a, b) => a.featured_order - b.featured_order);
  const unfeaturedProducts = products.filter((p) => !p.is_featured);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="font-serif text-3xl">Admin Panel</h1>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[{ label: "Sellers", value: stats.sellers }, { label: "Products", value: stats.products }, { label: "WA clicks", value: stats.clicks }].map((s) => (
            <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-warm">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-serif text-3xl text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="mt-8 flex flex-wrap gap-2">
          {(["sellers","categories","featured","homepage"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={tabCls(t)}>
              {t === "sellers" ? "Sellers" : t === "categories" ? "Categories" : t === "featured" ? "Featured Products" : "Homepage"}
            </button>
          ))}
        </div>

        {/* ── Sellers tab ── */}
        {activeTab === "sellers" && (
          <section className="mt-6">
            <h2 className="mb-3 font-serif text-xl">Sellers ({sellers.length})</h2>
            <div className="space-y-2">
              {sellers.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-warm">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link to="/store/$slug" params={{ slug: s.slug }} className="truncate font-medium hover:text-primary">{s.business_name}</Link>
                      {s.is_verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.category} · {s.city}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Verified</span>
                    <Switch checked={s.is_verified} onCheckedChange={() => toggleVerify(s.id, s.is_verified)} />
                  </div>
                </div>
              ))}
              {sellers.length === 0 && <p className="text-sm text-muted-foreground">No sellers yet.</p>}
            </div>
          </section>
        )}

        {/* ── Categories tab ── */}
        {activeTab === "categories" && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl">Categories ({categories.length})</h2>
              <Button onClick={openNewCat} size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-1 h-4 w-4" /> New category
              </Button>
            </div>
            <div className="space-y-2">
              {categories.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-warm">
                  <span className="text-2xl">{c.icon_emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveCat(c.id, "up")} disabled={idx === 0}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                    <button onClick={() => moveCat(c.id, "down")} disabled={idx === categories.length - 1}
                      className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                    <button onClick={() => openEditCat(c)} className="rounded p-1 hover:bg-muted">
                      <Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deleteCat(c.id, c.name)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured products tab ── */}
        {activeTab === "featured" && (
          <section className="mt-6">
            <h2 className="mb-2 font-serif text-xl">Featured Products ({featuredProducts.length})</h2>
            <p className="mb-4 text-xs text-muted-foreground">These products appear on the homepage. Reorder to control display priority.</p>

            {featuredProducts.length > 0 && (
              <div className="mb-6 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Featured ({featuredProducts.length})</p>
                {featuredProducts.map((p, idx) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-warm">
                    <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">₦{Number(p.price).toLocaleString()} · {(p.sellers as any)?.business_name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveFeatured(p.id, "up")} disabled={idx === 0}
                        className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                      <button onClick={() => moveFeatured(p.id, "down")} disabled={idx === featuredProducts.length - 1}
                        className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                      <button onClick={() => toggleFeatured(p)} className="rounded p-1 text-primary hover:bg-primary/10">
                        <StarOff className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">All products — click ⭐ to feature</p>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {unfeaturedProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-warm opacity-70 hover:opacity-100">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₦{Number(p.price).toLocaleString()} · {(p.sellers as any)?.business_name}</p>
                  </div>
                  <button onClick={() => toggleFeatured(p)} className="rounded p-1 text-muted-foreground hover:text-primary">
                    <Star className="h-4 w-4" /></button>
                </div>
              ))}
              {unfeaturedProducts.length === 0 && <p className="text-sm text-muted-foreground">All products are featured.</p>}
            </div>
          </section>
        )}

        {/* ── Homepage sections tab ── */}
        {activeTab === "homepage" && (
          <section className="mt-6">
            <h2 className="mb-2 font-serif text-xl">Homepage Sections</h2>
            <p className="mb-4 text-xs text-muted-foreground">Edit text, show/hide, and reorder sections on the homepage.</p>
            <div className="space-y-3">
              {sections.map((s, idx) => (
                <div key={s.id} className={`rounded-xl border bg-card p-4 shadow-warm ${!s.is_visible ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{s.title}</p>
                      {s.subtitle && <p className="text-xs text-muted-foreground">{s.subtitle}</p>}
                      {s.content  && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{s.content}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button onClick={() => moveSec(s.id, "up")} disabled={idx === 0}
                        className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronUp className="h-4 w-4" /></button>
                      <button onClick={() => moveSec(s.id, "down")} disabled={idx === sections.length - 1}
                        className="rounded p-1 hover:bg-muted disabled:opacity-30"><ChevronDown className="h-4 w-4" /></button>
                      <button onClick={() => toggleSectionVisible(s)} className="rounded p-1 hover:bg-muted">
                        {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => openEditSection(s)} className="rounded p-1 hover:bg-muted">
                        <Pencil className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <Button variant="ghost" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }} className="mt-10">
          Sign out
        </Button>
      </div>

      {/* Category editor dialog */}
      <Dialog open={newCatOpen} onOpenChange={(o) => !o && setNewCatOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCat ? "Edit category" : "New category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g. Electronics" /></div>
            <div><Label>Emoji icon</Label><Input value={catEmoji} onChange={(e) => setCatEmoji(e.target.value)} className="text-2xl" maxLength={4} /></div>
            <Button onClick={saveCat} disabled={catSaving} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {catSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Section editor dialog */}
      <Dialog open={!!editingSec} onOpenChange={(o) => !o && setEditingSec(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit section — <span className="text-muted-foreground font-normal">{editingSec?.key}</span></DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={secTitle} onChange={(e) => setSecTitle(e.target.value)} /></div>
            <div><Label>Subtitle (Hausa or tagline)</Label><Input value={secSubtitle} onChange={(e) => setSecSubtitle(e.target.value)} /></div>
            <div><Label>Body text (optional)</Label><Textarea value={secContent} onChange={(e) => setSecContent(e.target.value)} rows={3} /></div>
            <Button onClick={saveSection} disabled={secSaving} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              {secSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
