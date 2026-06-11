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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <label htmlFor={id} style={{ color: "#888", letterSpacing: "0.03em" }}>{label}</label>
        <span style={{ color: "#9B6FD4", fontWeight: 600, fontSize: 13 }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 99, background: "#2a2a2a" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, #6B3FA0, #9B6FD4)",
          width: `${((value - min) / (max - min)) * 100}%`,
          pointerEvents: "none"
        }} />
        <input id={id} type="range" min={min} max={max} step={1} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0, cursor: "pointer", margin: 0
          }} />
      </div>
    </div>
  );
}

interface ToggleBtnProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

function ToggleBtn({ active, onClick, icon, label }: ToggleBtnProps) {
  return (
    <button onClick={onClick} title={label} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
      padding: "10px 14px", borderRadius: 99, border: "none", cursor: "pointer",
      background: active ? "linear-gradient(135deg, #6B3FA0, #9B6FD4)" : "#1a1a1a",
      color: active ? "#fff" : "#888",
      fontSize: 11, fontWeight: 500, transition: "all .2s", minWidth: 56,
      boxShadow: active ? "0 0 12px rgba(107,63,160,0.5)" : "none"
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
      {label}
    </button>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>

      {/* Boutons de forme */}
      <div>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px" }}>Forme & Orientation</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ToggleBtn active={!isCircleCrop} onClick={() => setCircleCrop(false)} icon="ti-square-rounded" label="Rect" />
          <ToggleBtn active={isCircleCrop} onClick={() => setCircleCrop(true)} icon="ti-circle" label="Cercle" />
          <ToggleBtn active={flipH} onClick={() => setFlipH(!flipH)} icon="ti-flip-horizontal" label="Miroir H" />
          <ToggleBtn active={flipV} onClick={() => setFlipV(!flipV)} icon="ti-flip-vertical" label="Miroir V" />
        </div>
      </div>

      {/* Transformations */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Transformation</p>
        <Slider label="Taille" id="scale" min={20} max={200} value={scale} unit="%" onChange={setScale} />
        <Slider label="Position X" id="posX" min={-200} max={200} value={posX} onChange={setPosX} />
        <Slider label="Position Y" id="posY" min={-200} max={200} value={posY} onChange={setPosY} />
        <Slider label="Rotation" id="rotation" min={-180} max={180} value={rotation} unit="°" onChange={setRotation} />
      </div>

      {/* Couleurs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Couleurs</p>
        <Slider label="Luminosite" id="brightness" min={50} max={150} value={brightness} unit="%" onChange={setBrightness} />
        <Slider label="Contraste" id="contrast" min={50} max={150} value={contrast} unit="%" onChange={setContrast} />
      </div>

      {/* Texte */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Texte</p>
        <input type="text" placeholder="Ton prenom, ta phrase..." value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)} maxLength={40}
          style={{ width: "100%", background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 99, padding: "10px 16px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
            style={{ width: 36, height: 36, padding: 2, border: "none", borderRadius: 99, cursor: "pointer", background: "none" }} />
          <div style={{ flex: 1 }}>
            <Slider label="Taille texte" id="textSize" min={16} max={80} value={textSize} unit="px" onChange={setTextSize} />
          </div>
        </div>
      </div>

    </div>
  );
}