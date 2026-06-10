"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [user, setUser] = useState<{email?: string; user_metadata?: {full_name?: string}} | null>(null);
  const [frames, setFrames] = useState<{id:string;title:string;download_count:number;quota_limit:number|null;active:boolean}[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      const { data } = await supabase.from("frames").select("id,title,download_count,quota_limit,active").eq("owner_id", user.id).order("created_at", { ascending: false });
      setFrames(data ?? []);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 20, color: "#fff", textDecoration: "none" }}>🖼 J&apos;y Serai</Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: 13 }}>{user?.user_metadata?.full_name ?? user?.email}</span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "0.5px solid #333", color: "#aaa", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>Déconnexion</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Mes cadres</h1>
          <Link href="/nouveau-cadre" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
            + Nouveau cadre
          </Link>
        </div>

        {frames.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "#111", borderRadius: 16, border: "0.5px solid #222" }}>
            <p style={{ color: "#888", marginBottom: 20 }}>Tu n&apos;as pas encore de cadre.</p>
            <Link href="/nouveau-cadre" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14 }}>
              Créer mon premier cadre
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {frames.map(f => {
              const remaining = f.quota_limit != null ? f.quota_limit - f.download_count : null;
              const pct = f.quota_limit ? (f.download_count / f.quota_limit) * 100 : 0;
              return (
                <div key={f.id} style={{ background: "#111", border: "0.5px solid #222", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, margin: "0 0 4px" }}>{f.title}</p>
                    <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{f.download_count} téléchargements{remaining !== null ? ` · ${remaining} restants` : " · illimité"}</p>
                    {f.quota_limit && (
                      <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: "#222", overflow: "hidden", maxWidth: 200 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#ef4444" : "#6B3FA0", borderRadius: 2 }} />
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link href={`/editeur/${f.id}`} style={{ color: "#9B6FD4", fontSize: 13, textDecoration: "none", padding: "7px 14px", border: "0.5px solid #333", borderRadius: 8 }}>Aperçu</Link>
                    <Link href={`/galerie`} style={{ color: "#aaa", fontSize: 13, textDecoration: "none", padding: "7px 14px", border: "0.5px solid #333", borderRadius: 8 }}>Partager</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
