"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";
import { renderComposition, exportToPNG, triggerDownload } from "../../../lib/canvas/renderer";
import { Frame } from "../../../types";
import AdjustmentPanel from "@/src/components/editor/AdjustmentPanel";

export default function EditorPage() {
  const { frameId } = useParams();
  const supabase = createClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [state, setState] = useState<{ photoUrl: string | null }>({ photoUrl: null });
  const [frameUrl, setFrameUrl] = useState<string | null>(null);

  // Charger le cadre depuis Supabase
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("frames")
        .select("*")
        .eq("id", frameId)
        .single();
      if (data) {
        setFrame(data);
        setFrameUrl(data.image_url);
      }
      setLoading(false);
    }
    load();
  }, [frameId]);

  // Redessiner à chaque changement de state
  useEffect(() => {
    if (!canvasRef.current) return;
    renderComposition(canvasRef.current, state);
  }, [state]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setState({ photoUrl: URL.createObjectURL(file) });
  };

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      // Vérifier le quota
      const res = await fetch("/api/quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame_id: frameId }),
      });
      const { allowed, message } = await res.json();
      if (!allowed) {
        alert(message ?? "Quota épuisé.");
        return;
      }
      await renderComposition(canvasRef.current!, state);
      const blob = await exportToPNG(canvasRef.current!);
      triggerDownload(blob, `visuel-${frame?.title ?? "evenement"}.png`);
    } finally {
      setExporting(false);
    }
  }, [state, frameId, frame]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Chargement de l'éditeur…</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, padding: "24px 32px", alignItems: "start" }}>
      {/* Canvas */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <canvas
          ref={canvasRef}
          style={{ width: 420, height: 420, maxWidth: "100%", borderRadius: 8, background: "#111", display: "block" }}
        />
        <label style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 8, cursor: "pointer",
          border: "0.5px solid var(--color-border-secondary)",
          fontSize: 14, color: "var(--color-text-primary)"
        }}>
          <i className="ti ti-user-circle" style={{ fontSize: 18 }} aria-hidden="true" />
          Ajouter ma photo
          <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
        </label>

        <button
          onClick={handleDownload}
          disabled={exporting || !state.photoUrl}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 8, fontSize: 15,
            fontWeight: 500, cursor: "pointer",
            background: "var(--color-background-info)",
            color: "var(--color-text-info)",
            border: "none",
            opacity: exporting || !state.photoUrl ? 0.5 : 1,
          }}
        >
          <i className="ti ti-download" style={{ marginRight: 8 }} aria-hidden="true" />
          {exporting ? "Export en cours…" : "Télécharger mon visuel"}
        </button>
      </div>

      {/* Panneau d'ajustements */}
      <div>
        <p style={{ fontWeight: 500, fontSize: 15, margin: "0 0 16px" }}>
          {frame?.title ?? "Éditeur"}
        </p>
        < AdjustmentPanel />
      </div>
    </div>
  );
}

