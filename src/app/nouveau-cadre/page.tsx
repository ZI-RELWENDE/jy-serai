"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NouveauCadrePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (!title || !file) { setError("Titre et image requis"); return; }
    setLoading(true); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("frames").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("frames").getPublicUrl(path);
      const { error: dbError } = await supabase.from("frames").insert({
        owner_id: user.id, title, description,
        image_url: publicUrl, thumbnail_url: publicUrl,
        is_public: isPublic, download_count: 0, active: true,
        quota_limit: isPublic ? null : 50,
      });
      if (dbError) throw dbError;
      router.push("/dashboard");
    } catch (e) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <Link href="/dashboard" style={{ color: "#9B6FD4", textDecoration: "none", fontSize: 14 }}>← Dashboard</Link>
        <span style={{ fontWeight: 700, fontSize: 18 }}>Nouveau cadre</span>
        <div style={{ width: 80 }} />
      </header>
      <div style={{ maxWidth: 560, margin: "40px auto", padding: "0 24px" }}>
        {error && <p style={{ background: "#2a1010", color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Titre du cadre *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: GENESIS 2026"
              style={{ width: "100%", background: "#111", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description optionnelle" rows={3}
              style={{ width: "100%", background: "#111", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Image du cadre (PNG transparent) *</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)}
              style={{ width: "100%", background: "#111", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="public" style={{ fontSize: 14, color: "#ccc" }}>Cadre public (visible par tous)</label>
          </div>
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: "#6B3FA0", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Publication..." : "Publier le cadre"}
          </button>
        </div>
      </div>
    </main>
  );
}