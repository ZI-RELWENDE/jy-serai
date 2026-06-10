import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "0.5px solid #222" }}>
        <span style={{ fontWeight: 700, fontSize: 22 }}>Jy Serai</span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ color: "#aaa", textDecoration: "none", fontSize: 14, padding: "8px 16px" }}>Connexion</Link>
          <Link href="/register" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 14, padding: "8px 18px", borderRadius: 8 }}>Creer un compte</Link>
        </div>
      </header>
      <section style={{ textAlign: "center", padding: "80px 20px 60px" }}>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 800, margin: "0 0 24px", color: "#fff" }}>
          Cree ton visuel <span style={{ color: "#9B6FD4" }}>en 30 secondes</span>
        </h1>
        <p style={{ color: "#888", fontSize: 18, maxWidth: 520, margin: "0 auto 40px" }}>
          Choisis un cadre, ajoute ta photo, ajuste et telecharge.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/galerie" style={{ background: "#6B3FA0", color: "#fff", textDecoration: "none", fontSize: 15, padding: "14px 32px", borderRadius: 10, fontWeight: 600 }}>Voir les cadres</Link>
          <Link href="/register" style={{ border: "0.5px solid #333", color: "#fff", textDecoration: "none", fontSize: 15, padding: "14px 32px", borderRadius: 10 }}>Publier mon cadre</Link>
        </div>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        {[
          { title: "Cadres PNG transparents", desc: "Upload ton cadre en PNG, il s'applique par-dessus la photo." },
          { title: "Recadrage circulaire", desc: "Decoupe ta photo en cercle pour un rendu professionnel." },
          { title: "Texte personnalise", desc: "Ajoute ton prenom ou un message sur le visuel." },
          { title: "Partage direct", desc: "Telecharge en haute resolution, pret pour WhatsApp." },
        ].map((f) => (
          <div key={f.title} style={{ background: "#111", border: "0.5px solid #222", borderRadius: 12, padding: "24px 20px" }}>
            <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 8px" }}>{f.title}</p>
            <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </section>
      <section style={{ background: "#111", borderTop: "0.5px solid #222", padding: "60px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>Tu organises un evenement ?</h2>
        <p style={{ color: "#888", fontSize: 16, margin: "0 0 32px" }}>Publie ton cadre, choisis un quota et partage le lien.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", fontSize: 14, color: "#aaa" }}>
          {["Pack 50 DL - 2 500 XOF", "Pack 200 DL - 7 500 XOF", "Pack 500 DL - 15 000 XOF"].map((p) => (
            <span key={p} style={{ background: "#1a1a1a", border: "0.5px solid #333", padding: "10px 20px", borderRadius: 8 }}>{p}</span>
          ))}
        </div>
      </section>
      <footer style={{ textAlign: "center", padding: "24px", color: "#555", fontSize: 13 }}>
        2026 - Jy Serai
      </footer>
    </main>
  );
}
