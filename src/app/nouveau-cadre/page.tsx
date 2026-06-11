"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Plan {
  id: string;
  name: string;
  price_xof: number;
  duration_days: number;
  max_frames: number;
  has_watermark: boolean;
  has_stats: boolean;
  has_qr_code: boolean;
}

export default function NouveauCadrePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.from("plans").select("*").eq("is_active", true).order("price_xof").then(({ data }) => {
      setPlans(data ?? []);
      if (data?.length) setSelectedPlan(data[0]);
    });
  }, []);

  async function handleSubmit() {
    if (!title || !file) { setError("Titre et image requis"); return; }
    if (!selectedPlan) { setError("Choisis un forfait"); return; }
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
        plan_id: selectedPlan.id,
        has_watermark: selectedPlan.has_watermark,
        expires_at: selectedPlan.duration_days
          ? new Date(Date.now() + selectedPlan.duration_days * 86400000).toISOString()
          : null,
      });
      if (dbError) throw dbError;
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
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

      <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 24px" }}>
        {error && <p style={{ background: "#2a1010", color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

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

          <div>
            <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 10 }}>Choisir un forfait *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plans.map(plan => (
                <div key={plan.id} onClick={() => setSelectedPlan(plan)}
                  style={{
                    padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    border: selectedPlan?.id === plan.id ? "2px solid #6B3FA0" : "0.5px solid #333",
                    background: selectedPlan?.id === plan.id ? "#1a1020" : "#111",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{plan.name}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#888" }}>
                      {plan.duration_days} jours · {plan.max_frames} cadre{plan.max_frames > 1 ? "s" : ""}
                      {plan.has_watermark ? " · Logo J'y Serai" : " · Sans filigrane"}
                      {plan.has_qr_code ? " · QR Code" : ""}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: plan.price_xof === 0 ? "#4ade80" : "#9B6FD4" }}>
                      {plan.price_xof === 0 ? "Gratuit" : `${plan.price_xof.toLocaleString()} FCFA`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="public" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
            <label htmlFor="public" style={{ fontSize: 14, color: "#ccc" }}>Cadre visible dans la galerie publique</label>
          </div>

          {selectedPlan && selectedPlan.price_xof > 0 && (
            <div style={{ background: "#1a1020", border: "0.5px solid #6B3FA0", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#ccc" }}>
              Apres validation, tu seras redirige vers le paiement CinetPay ({selectedPlan.price_xof.toLocaleString()} FCFA via Orange Money, Moov, Wave ou carte).
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: "#6B3FA0", color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Publication..." : selectedPlan?.price_xof === 0 ? "Publier gratuitement" : "Continuer vers le paiement"}
          </button>

        </div>
      </div>
    </main>
  );
}