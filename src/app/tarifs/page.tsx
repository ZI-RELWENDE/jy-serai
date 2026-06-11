"use client";
import { useEffect, useState } from "react";
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
  has_multi_admin: boolean;
}

const icons: Record<string, string> = {
  "Découverte": "ti-eye",
  "Starter": "ti-bolt",
  "Standard": "ti-star",
  "Premium": "ti-crown",
};

export default function TarifsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("plans").select("*").eq("is_active", true).order("price_xof").then(({ data }) => setPlans(data ?? []));
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <Link href="/"><img src="/jy_serai.png" alt="Jy Serai" style={{ height: 36 }} /></Link>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/galerie" style={{ color: "#aaa", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Galerie</Link>
          <Link href="/login" style={{ color: "#aaa", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Connexion</Link>
          <Link href="/register" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 14, padding: "8px 18px", borderRadius: 8 }}>Commencer</Link>
        </div>
      </header>

      <section style={{ textAlign: "center", padding: "60px 24px 40px" }}>
        <p style={{ color: "#9B6FD4", fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Tarification simple</p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "0 0 16px" }}>Choisis ton forfait</h1>
        <p style={{ color: "#888", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
          Paiement unique par evenement. Aucun abonnement. Orange Money, Moov, Wave ou carte.
        </p>
      </section>

      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {plans.map((plan, i) => {
            const isRecommended = plan.name === "Standard";
            return (
              <div key={plan.id} style={{
                background: "#111",
                border: isRecommended ? "2px solid #6B3FA0" : "0.5px solid #222",
                borderRadius: 16, padding: "24px 20px",
                display: "flex", flexDirection: "column", gap: 16,
                position: "relative"
              }}>
                {isRecommended && (
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#6B3FA0", color: "#fff", fontSize: 11, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap", fontWeight: 600 }}>
                    Recommande
                  </span>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <i className={`ti ${icons[plan.name] ?? "ti-package"}`} style={{ fontSize: 22, color: isRecommended ? "#9B6FD4" : "#888" }} aria-hidden="true" />
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{plan.name}</span>
                </div>

                <div>
                  <p style={{ fontSize: 28, fontWeight: 800, margin: 0, color: plan.price_xof === 0 ? "#4ade80" : "#fff" }}>
                    {plan.price_xof === 0 ? "Gratuit" : `${plan.price_xof.toLocaleString()}`}
                    {plan.price_xof > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: "#888" }}> FCFA</span>}
                  </p>
                  <p style={{ color: "#888", fontSize: 13, margin: "6px 0 0" }}>{plan.duration_days} jours · {plan.max_frames} cadre{plan.max_frames > 1 ? "s" : ""}</p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {[
                    { ok: true, label: `${plan.max_frames} cadre${plan.max_frames > 1 ? "s" : ""}` },
                    { ok: true, label: "Telechargements illimites" },
                    { ok: true, label: `${plan.duration_days} jours d'activite` },
                    { ok: !plan.has_watermark, label: "Sans filigrane" },
                    { ok: plan.has_stats, label: "Statistiques" },
                    { ok: plan.has_qr_code, label: "QR Code inclus" },
                    { ok: plan.has_multi_admin, label: "Multi-administrateurs" },
                  ].map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: f.ok ? "#ccc" : "#444" }}>
                      <i className={`ti ${f.ok ? "ti-check" : "ti-x"}`} style={{ fontSize: 14, color: f.ok ? "#4ade80" : "#444" }} aria-hidden="true" />
                      {f.label}
                    </div>
                  ))}
                </div>

                <Link href="/register" style={{
                  display: "block", textAlign: "center", padding: "12px",
                  borderRadius: 99, textDecoration: "none", fontSize: 14, fontWeight: 600,
                  background: isRecommended ? "#6B3FA0" : "transparent",
                  color: isRecommended ? "#fff" : "#9B6FD4",
                  border: isRecommended ? "none" : "0.5px solid #6B3FA0",
                }}>
                  {plan.price_xof === 0 ? "Commencer gratuitement" : "Choisir ce forfait"}
                </Link>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 48, textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 16 }}>Moyen de paiement acceptes</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {["Orange Money", "Moov Money", "Telecel Money", "Wave", "Carte bancaire"].map(m => (
              <span key={m} style={{ background: "#1a1a1a", border: "0.5px solid #333", padding: "8px 16px", borderRadius: 99, fontSize: 13, color: "#aaa" }}>{m}</span>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "24px", color: "#555", fontSize: 13, borderTop: "0.5px solid #1a1a1a" }}>
        2026 - Jy Serai
      </footer>
    </main>
  );
}