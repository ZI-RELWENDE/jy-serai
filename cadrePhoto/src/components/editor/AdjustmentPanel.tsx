"use client";

import { useEditorStore } from "@/store/editorStore";

interface SliderProps {
  label: string;
  id: string;
  min: number;
  max: number;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, id, min, max, value, unit = "", onChange }: SliderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <label htmlFor={id} style={{ color: "var(--color-text-secondary)" }}>{label}</label>
        <span style={{ color: "var(--color-text-primary)", fontWeight: 500 }}>
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default function AdjustmentPanel() {
  const {
    scale, setScale,
    posX, setPosX,
    posY, setPosY,
    rotation, setRotation,
    brightness, setBrightness,
    contrast, setContrast,
    isCircleCrop, setCircleCrop,
    flipH, setFlipH,
    flipV, setFlipV,
    textOverlay, setTextOverlay,
    textColor, setTextColor,
    textSize, setTextSize,
  } = useEditorStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Recadrage & flip */}
      <div style={{
        background: "var(--color-background-secondary)",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setCircleCrop(!isCircleCrop)}
          style={{ fontSize: 12, fontWeight: isCircleCrop ? 500 : 400 }}
        >
          {isCircleCrop ? "◉ Cercle" : "⬜ Rectangle"}
        </button>
        <button onClick={() => setFlipH(!flipH)} style={{ fontSize: 12 }}>
          ⇄ Miroir H
        </button>
        <button onClick={() => setFlipV(!flipV)} style={{ fontSize: 12 }}>
          ⇅ Miroir V
        </button>
      </div>

      {/* Transformations */}
      <Slider label="Taille" id="scale" min={20} max={200} value={scale} unit="%" onChange={setScale} />
      <Slider label="Position X" id="posX" min={-200} max={200} value={posX} onChange={setPosX} />
      <Slider label="Position Y" id="posY" min={-200} max={200} value={posY} onChange={setPosY} />
      <Slider label="Rotation" id="rotation" min={-180} max={180} value={rotation} unit="°" onChange={setRotation} />

      {/* Couleur */}
      <Slider label="Luminosité" id="brightness" min={50} max={150} value={brightness} unit="%" onChange={setBrightness} />
      <Slider label="Contraste" id="contrast" min={50} max={150} value={contrast} unit="%" onChange={setContrast} />

      {/* Texte */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Texte personnalisé</label>
        <input
          type="text"
          placeholder="Ton prénom, ta phrase..."
          value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)}
          maxLength={40}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            style={{ width: 36, height: 28, padding: 2, border: "0.5px solid var(--color-border-tertiary)", borderRadius: 6 }}
          />
          <Slider label="Taille texte" id="textSize" min={16} max={80} value={textSize} unit="px" onChange={setTextSize} />
        </div>
      </div>

    </div>
  );
}
