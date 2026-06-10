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
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <label htmlFor={id} style={{ color: "var(--color-text-secondary, #888)" }}>{label}</label>
        <span style={{ color: "#fff", fontWeight: 500 }}>{value}{unit}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#6B3FA0" }} />
    </div>
  );
}

export default function AdjustmentPanel() {
  const {
    scale, setScale, posX, setPosX, posY, setPosY,
    rotation, setRotation, brightness, setBrightness,
    contrast, setContrast, isCircleCrop, setCircleCrop,
    flipH, setFlipH, flipV, setFlipV,
    textOverlay, setTextOverlay, textColor, setTextColor, textSize, setTextSize,
  } = useEditorStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Boutons */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setCircleCrop(!isCircleCrop)}
          style={{ fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "0.5px solid #444", background: isCircleCrop ? "#6B3FA0" : "#1a1a1a", color: "#fff", cursor: "pointer" }}>
          {isCircleCrop ? "Cercle" : "Rectangle"}
        </button>
        <button onClick={() => setFlipH(!flipH)}
          style={{ fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "0.5px solid #444", background: flipH ? "#6B3FA0" : "#1a1a1a", color: "#fff", cursor: "pointer" }}>
          Miroir H
        </button>
        <button onClick={() => setFlipV(!flipV)}
          style={{ fontSize: 13, padding: "8px 14px", borderRadius: 8, border: "0.5px solid #444", background: flipV ? "#6B3FA0" : "#1a1a1a", color: "#fff", cursor: "pointer" }}>
          Miroir V
        </button>
      </div>

      <Slider label="Taille" id="scale" min={20} max={200} value={scale} unit="%" onChange={setScale} />
      <Slider label="Position X" id="posX" min={-200} max={200} value={posX} onChange={setPosX} />
      <Slider label="Position Y" id="posY" min={-200} max={200} value={posY} onChange={setPosY} />
      <Slider label="Rotation" id="rotation" min={-180} max={180} value={rotation} unit="°" onChange={setRotation} />
      <Slider label="Luminosite" id="brightness" min={50} max={150} value={brightness} unit="%" onChange={setBrightness} />
      <Slider label="Contraste" id="contrast" min={50} max={150} value={contrast} unit="%" onChange={setContrast} />

      {/* Texte */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label style={{ fontSize: 13, color: "#888" }}>Texte personnalise</label>
        <input type="text" placeholder="Ton prenom, ta phrase..." value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)} maxLength={40}
          style={{ width: "100%", background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
            style={{ width: 40, height: 32, padding: 2, border: "0.5px solid #333", borderRadius: 6, cursor: "pointer" }} />
          <Slider label="Taille texte" id="textSize" min={16} max={80} value={textSize} unit="px" onChange={setTextSize} />
        </div>
      </div>

    </div>
  );
}