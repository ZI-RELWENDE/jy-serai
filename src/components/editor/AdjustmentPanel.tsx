"use client";
import { useState } from "react";
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
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0 }} />
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
      fontSize: 11, fontWeight: 500, minWidth: 56,
      boxShadow: active ? "0 0 12px rgba(107,63,160,0.5)" : "none"
    }}>
      <i className={`ti ${icon}`} style={{ fontSize: 18 }} aria-hidden="true" />
      {label}
    </button>
  );
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px", borderRadius: 99, border: "0.5px solid #333",
        background: "#1a1a1a", cursor: "pointer", width: "100%"
      }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: value, border: "2px solid #444", flexShrink: 0 }} />
        <span style={{ color: "#aaa", fontSize: 13 }}>Couleur du texte</span>
        <span style={{ color: "#9B6FD4", fontSize: 12, marginLeft: "auto", fontFamily: "monospace" }}>{value.toUpperCase()}</span>
        <i className="ti ti-chevron-down" style={{ fontSize: 14, color: "#666" }} aria-hidden="true" />
      </button>

      {open && (
        <div style={{
          marginTop: 8, background: "#1a1a1a", border: "0.5px solid #333",
          borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12
        }}>
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", height: 180, border: "none", borderRadius: 12, cursor: "pointer", background: "none", padding: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: value, border: "2px solid #444", flexShrink: 0 }} />
            <input type="text" value={value} onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
              style={{ flex: 1, background: "#111", border: "0.5px solid #444", borderRadius: 99, padding: "8px 14px", color: "#fff", fontSize: 13, fontFamily: "monospace" }} />
          </div>
          <button onClick={() => setOpen(false)} style={{
            padding: "9px", borderRadius: 99, border: "none",
            background: "linear-gradient(135deg, #6B3FA0, #9B6FD4)",
            color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>
            Confirmer
          </button>
        </div>
      )}
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "4px 0" }}>

      <div>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 10px" }}>Forme & Orientation</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <ToggleBtn active={!isCircleCrop} onClick={() => setCircleCrop(false)} icon="ti-square-rounded" label="Rect" />
          <ToggleBtn active={isCircleCrop} onClick={() => setCircleCrop(true)} icon="ti-circle" label="Cercle" />
          <ToggleBtn active={flipH} onClick={() => setFlipH(!flipH)} icon="ti-flip-horizontal" label="Miroir H" />
          <ToggleBtn active={flipV} onClick={() => setFlipV(!flipV)} icon="ti-flip-vertical" label="Miroir V" />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Transformation</p>
        <Slider label="Taille" id="scale" min={20} max={200} value={scale} unit="%" onChange={setScale} />
        <Slider label="Position X" id="posX" min={-200} max={200} value={posX} onChange={setPosX} />
        <Slider label="Position Y" id="posY" min={-200} max={200} value={posY} onChange={setPosY} />
        <Slider label="Rotation" id="rotation" min={-180} max={180} value={rotation} unit="°" onChange={setRotation} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Couleurs</p>
        <Slider label="Luminosite" id="brightness" min={50} max={150} value={brightness} unit="%" onChange={setBrightness} />
        <Slider label="Contraste" id="contrast" min={50} max={150} value={contrast} unit="%" onChange={setContrast} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: "0.05em", textTransform: "uppercase", margin: 0 }}>Texte</p>
        <input type="text" placeholder="Ton prenom, ta phrase..." value={textOverlay}
          onChange={(e) => setTextOverlay(e.target.value)} maxLength={40}
          style={{ width: "100%", background: "#1a1a1a", border: "0.5px solid #333", borderRadius: 99, padding: "10px 16px", color: "#fff", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
        <Slider label="Taille texte" id="textSize" min={16} max={80} value={textSize} unit="px" onChange={setTextSize} />
        <ColorPicker value={textColor} onChange={setTextColor} />
      </div>

    </div>
  );
}