"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/store/editorStore";
import { renderComposition } from "@/lib/canvas/renderer";

interface EditorCanvasProps {
  /** Taille d'affichage en px (le rendu interne est toujours 1080x1080) */
  displaySize?: number;
}

export default function EditorCanvas({ displaySize = 420 }: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useEditorStore();

  const redraw = useCallback(async () => {
    if (!canvasRef.current) return;
    await renderComposition(canvasRef.current, state);
  }, [state]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: displaySize,
        height: displaySize,
        borderRadius: 8,
        display: "block",
        background: "#111",
        maxWidth: "100%",
      }}
    />
  );
}

// Expose le ref pour l'export PNG depuis le parent
export { EditorCanvas };
