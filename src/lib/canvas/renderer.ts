import { EditorState } from "@/types";

/**
 * Charge une image depuis une URL (gère le CORS pour les images Supabase).
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Dessine la composition photo + cadre sur un canvas.
 * Retourne le canvas pour permettre l'export PNG.
 */
export async function renderComposition(
  canvas: HTMLCanvasElement,
  state: EditorState
): Promise<void> {
  const SIZE = 1080; // export haute résolution
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (state.photoUrl) {
    const photo = await loadImage(state.photoUrl);
    ctx.save();

    // Recadrage circulaire
    if (state.isCircleCrop) {
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    const sc = state.scale / 100;
    ctx.translate(SIZE / 2 + state.posX * (SIZE / 420), SIZE / 2 + state.posY * (SIZE / 420));
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.flipH ? -sc : sc, state.flipV ? -sc : sc);

    // Luminosité & contraste via filter
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`;

    const w = photo.width;
    const h = photo.height;
    // Adapter la photo pour couvrir le canvas (cover)
    const ratio = Math.max(SIZE / w, SIZE / h);
    const dw = w * ratio * sc;
    const dh = h * ratio * sc;
    ctx.drawImage(photo, -dw / 2 / sc, -dh / 2 / sc, dw / sc, dh / sc);
    ctx.filter = "none";
    ctx.restore();
  }

  if (state.frameUrl) {
    const frame = await loadImage(state.frameUrl);
    ctx.drawImage(frame, 0, 0, SIZE, SIZE);
  }

  // Texte personnalisé
  if (state.textOverlay.trim()) {
    ctx.save();
    ctx.font = `bold ${state.textSize * (SIZE / 420)}px sans-serif`;
    ctx.fillStyle = state.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.fillText(state.textOverlay, SIZE / 2, SIZE - 40);
    ctx.restore();
  }
}

/**
 * Exporte le canvas en blob PNG haute résolution.
 */
export function exportToPNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export échoué"))),
      "image/png",
      1.0
    );
  });
}

/**
 * Déclenche le téléchargement du fichier dans le navigateur.
 */
export function triggerDownload(blob: Blob, filename = "mon-visuel.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
