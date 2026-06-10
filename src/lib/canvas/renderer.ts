import { EditorState } from "@/types";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderComposition(
  canvas: HTMLCanvasElement,
  state: EditorState
): Promise<void> {
  // Charger le cadre en premier pour connaitre ses dimensions
  let frameImg: HTMLImageElement | null = null;
  if (state.frameUrl) {
    frameImg = await loadImage(state.frameUrl);
  }

  const W = frameImg ? frameImg.naturalWidth : 1080;
  const H = frameImg ? frameImg.naturalHeight : 1080;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);

  if (state.photoUrl) {
    const photo = await loadImage(state.photoUrl);
    ctx.save();

    const sc = state.scale / 100;
    const cx = W / 2 + state.posX * (W / 420);
    const cy = H / 2 + state.posY * (H / 420);

    if (state.isCircleCrop) {
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(W, H) / 2, 0, Math.PI * 2);
      ctx.clip();
    }

    ctx.translate(cx, cy);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.flipH ? -sc : sc, state.flipV ? -sc : sc);
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`;

    const ratio = Math.max(W / photo.width, H / photo.height);
    const dw = photo.width * ratio;
    const dh = photo.height * ratio;
    ctx.drawImage(photo, -dw / 2, -dh / 2, dw, dh);
    ctx.filter = "none";
    ctx.restore();
  }

  if (frameImg) {
    ctx.drawImage(frameImg, 0, 0, W, H);
  }

  if (state.textOverlay.trim()) {
    ctx.save();
    ctx.font = `bold ${state.textSize * (W / 420)}px sans-serif`;
    ctx.fillStyle = state.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 8;
    ctx.fillText(state.textOverlay, W / 2, H - 40);
    ctx.restore();
  }
}

export function exportToPNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export echoue"))),
      "image/png",
      1.0
    );
  });
}

export function triggerDownload(blob: Blob, filename = "mon-visuel.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}