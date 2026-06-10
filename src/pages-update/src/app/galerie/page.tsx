"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Frame { id: string; title: string; thumbnail_url: string; download_count: number; category: string | null; owner: { full_name: string | null } | null; }

export default function GaleriePage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("frames")
        .select("id, title, thumbnail_url, download_count, category, owner:profiles(full_name)")
        .eq("is_public", true).eq("active", true)
        .order("created_at", { ascending: false });
      setFrames((data as unknown as Frame[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 20, color: "#fff", textDecoration: "none" }}>🖼 J&apos;y Serai</Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ color: "#aaa", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Connexion</Link>
          <Link href="/register" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 14, padding: "8px 18px", borderRadius: 8 }}>Compte</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>Galerie de cadres</h1>
        <p style={{ color: "#888", margin: "0 0 32px" }}>Choisis un cadre, ajoute ta photo et télécharge ton visuel.</p>

        {loading && <p style={{ color: "#888" }}>Chargement…</p>}

        {!loading && frames.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "#888", fontSize: 16, marginBottom: 20 }}>Aucun cadre publié pour l&apos;instant.</p>
            <Link href="/register" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
              Publier le premier cadre
            </Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {frames.map(frame => (
            <div key={frame.id} style={{ background: "#111", border: "0.5px solid #222", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ aspectRatio: "1", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                {frame.thumbnail_url
                  ? <img src={frame.thumbnail_url} alt={frame.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : "🖼"}
              </div>
              <div style={{ padding: "14px" }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>{frame.title}</p>
                {frame.owner?.full_name && <p style={{ color: "#888", fontSize: 12, margin: "0 0 4px" }}>par {frame.owner.full_name}</p>}
                <p style={{ color: "#888", fontSize: 12, margin: "0 0 12px" }}>{frame.download_count} téléchargements</p>
                <Link href={`/editeur/${frame.id}`} style={{
                  display: "block", textAlign: "center", padding: "9px", borderRadius: 8,
                  background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 500
                }}>
                  Utiliser ce cadre
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
