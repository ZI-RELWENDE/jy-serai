import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.5 }}>
          🖼 J&apos;y Serai
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ color: "#aaa", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Connexion</Link>
          <Link href="/register" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 14, padding: "8px 18px", borderRadius: 8, fontWeight: 500 }}>Créer un compte</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 20px 60px" }}>
        <p style={{ color: "#9B6FD4", fontSize: 13, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Plateforme de cadres événementiels</p>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: -1 }}>
          Crée ton visuel<br />
          <span style={{ color: "#9B6FD4" }}>« J&apos;y serai »</span> en 30 secondes
        </h1>
        <p style={{ color: "#888", fontSize: 18, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Choisis un cadre, ajoute ta photo, ajuste et télécharge. Partageable immédiatement sur WhatsApp et Facebook.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/galerie" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 15, padding: "14px 32px", borderRadius: 10, fontWeight: 600 }}>
            Voir les cadres →
          </Link>
          <Link href="/register" style={{ border: "0.5px solid #333", color: "#fff", textDecoration: "none", fontSize: 15, padding: "14px 32px", borderRadius: 10 }}>
            Publier mon cadre
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        {[
          { icon: "🖼", title: "Cadres PNG transparents", desc: "Upload ton cadre en PNG, il s'applique par-dessus la photo automatiquement." },
          { icon: "✂️", title: "Recadrage circulaire", desc: "Découpe ta photo en cercle pour un rendu professionnel." },
          { icon: "✏️", title: "Texte personnalisé", desc: "Ajoute ton prénom ou un message directement sur le visuel." },
          { icon: "📲", title: "Partage direct", desc: "Télécharge en haute résolution, prêt pour WhatsApp et les réseaux." },
        ].map((f) => (
          <div key={f.title} style={{ background: "#111", border: "0.5px solid #222", borderRadius: 12, padding: "24px 20px" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>{f.title}</p>
            <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA organisateurs */}
      <section style={{ background: "#111", borderTop: "0.5px solid #222", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>Tu organises un événement ?</h2>
        <p style={{ color: "#888", fontSize: 16, margin: "0 0 32px" }}>Publie ton cadre, choisis un quota de téléchargements et partage le lien à tes participants.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: 14, color: "#aaa" }}>
          {["Pack 50 DL — 2 500 XOF", "Pack 200 DL — 7 500 XOF", "Pack 500 DL — 15 000 XOF"].map((p) => (
            <span key={p} style={{ background: "#1a1a1a", border: "0.5px solid #333", padding: "10px 20px", borderRadius: 8 }}>{p}</span>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "24px", color: "#555", fontSize: 13, borderTop: "0.5px solid #1a1a1a" }}>
        © 2026 J&apos;y Serai · Plateforme de cadres événementiels
      </footer>
    </main>
  );
}
