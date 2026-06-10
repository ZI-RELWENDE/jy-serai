"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEditorStore } from "@/store/editorStore";
import { renderComposition, exportToPNG, triggerDownload } from "@/lib/canvas/renderer";
import AdjustmentPanel from "@/components/editor/AdjustmentPanel";

export default function EditorPage() {
  const params = useParams();
  const frameId = params.frameId as string;
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frameTitle, setFrameTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const state = useEditorStore();
  const { setFrame, setPhoto } = useEditorStore();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("frames").select("*").eq("id", frameId).single();
      if (data) {
        setFrameTitle(data.title);
        setFrame(data.image_url);
        const img = new Image();
        img.onload = () => setAspectRatio(img.naturalHeight / img.naturalWidth);
        img.src = data.image_url;
      }
      setLoading(false);
    }
    load();
  }, [frameId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderComposition(canvasRef.current, state);
  }, [state]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      const res = await fetch("/api/quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame_id: frameId }),
      });
      const { allowed, message } = await res.json();
      if (!allowed) { alert(message ?? "Quota epuise."); return; }
      await renderComposition(canvasRef.current, state);
      const blob = await exportToPNG(canvasRef.current);
      triggerDownload(blob, `visuel-${frameTitle}.png`);
    } finally {
      setExporting(false);
    }
  }, [state, frameId, frameTitle]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0a0a", color: "#888", fontFamily: "sans-serif" }}>
      Chargement...
    </div>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "0.5px solid #222" }}>
        <a href="/galerie" style={{ color: "#9B6FD4", textDecoration: "none", fontSize: 14 }}>← Galerie</a>
        <span style={{ fontWeight: 600, fontSize: 16 }}>{frameTitle}</span>
        <div style={{ width: 60 }} />
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px" }}>
        
        {/* Canvas centré */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <canvas ref={canvasRef} style={{
            width: "100%",
            maxWidth: 380,
            height: "auto",
            aspectRatio: `1 / ${aspectRatio}`,
            borderRadius: 8,
            background: "#111",
            display: "block"
          }} />
          <label style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, padding: "12px 24px", borderRadius: 8, cursor: "pointer",
            border: "0.5px solid #333", fontSize: 14, color: "#fff", width: "100%", maxWidth: 380, boxSizing: "border-box"
          }}>
            Ajouter ma photo
            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
          </label>
          <button onClick={handleDownload} disabled={exporting || !state.photoUrl}
            style={{
              width: "100%", maxWidth: 380, padding: "14px 0", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              background: "#6B3FA0", color: "#fff", border: "none",
              opacity: exporting || !state.photoUrl ? 0.5 : 1,
              boxSizing: "border-box"
            }}>
            {exporting ? "Export en cours..." : "Telecharger mon visuel"}
          </button>
        </div>

        {/* Panneau ajustements en dessous */}
        <div style={{
          background: "#111", border: "0.5px solid #222",
          borderRadius: 12, padding: "20px 16px"
        }}>
          <AdjustmentPanel />
        </div>

      </div>
    </main>
  );
}