"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister() {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "#111", border: "0.5px solid #222", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: "#9B6FD4", fontSize: 13, textDecoration: "none" }}>← Accueil</Link>
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "16px 0 8px" }}>Créer un compte</h1>
        <p style={{ color: "#888", fontSize: 14, margin: "0 0 28px" }}>Gratuit — publie tes cadres ou utilise ceux de la communauté</p>

        {error && <p style={{ background: "#2a1010", color: "#f87171", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="text" placeholder="Nom complet" value={fullName} onChange={e => setFullName(e.target.value)}
            style={{ background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          <input type="password" placeholder="Mot de passe (min. 6 caractères)" value={password} onChange={e => setPassword(e.target.value)}
            style={{ background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
          <button onClick={handleRegister} disabled={loading}
            style={{ background: "#6B3FA0", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </div>

        <p style={{ color: "#888", fontSize: 13, marginTop: 20, textAlign: "center" }}>
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: "#9B6FD4", textDecoration: "none" }}>Se connecter</Link>
        </p>
      </div>
    </main>
  );
}
