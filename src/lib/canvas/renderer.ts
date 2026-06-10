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
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (state.photoUrl) {
    const photo = await loadImage(state.photoUrl);
    ctx.save();
    if (state.isCircleCrop) {
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    const sc = state.scale / 100;
    ctx.translate(SIZE / 2 + state.posX * (SIZE / 420), SIZE / 2 + state.posY * (SIZE / 420));
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.flipH ? -sc : sc, state.flipV ? -sc : sc);
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`;
    const ratio = Math.min(SIZE / photo.width, SIZE / photo.height);
    const dw = photo.width * ratio;
    const dh = photo.height * ratio;
    ctx.drawImage(photo, -dw / 2, -dh / 2, dw, dh);
    ctx.filter = "none";
    ctx.restore();
  }

  if (state.frameUrl) {
    const frame = await loadImage(state.frameUrl);
    ctx.drawImage(frame, 0, 0, SIZE, SIZE);
  }

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