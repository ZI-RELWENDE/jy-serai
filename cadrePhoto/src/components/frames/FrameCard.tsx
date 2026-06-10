"use client";

import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/types";

interface FrameCardProps {
  frame: Frame;
  showOwner?: boolean;
}

export default function FrameCard({ frame, showOwner = false }: FrameCardProps) {
  const quotaUsed = frame.quota_limit
    ? Math.round((frame.download_count / frame.quota_limit) * 100)
    : null;

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: 12,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Miniature */}
      <div style={{ position: "relative", aspectRatio: "1", background: "#111" }}>
        <Image
          src={frame.thumbnail_url}
          alt={frame.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {!frame.is_public && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            fontSize: 10, padding: "3px 7px", borderRadius: 20
          }}>
            Privé
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{frame.title}</p>

        {showOwner && frame.owner && (
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
            par {frame.owner.full_name ?? frame.owner.email}
          </p>
        )}

        <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
          {frame.download_count} téléchargement{frame.download_count !== 1 ? "s" : ""}
        </p>

        {/* Barre de quota */}
        {quotaUsed !== null && (
          <div>
            <div style={{
              height: 4, borderRadius: 2,
              background: "var(--color-background-secondary)",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%", width: `${quotaUsed}%`,
                background: quotaUsed > 80 ? "var(--color-text-danger)" : "var(--color-text-info)",
                borderRadius: 2, transition: "width .3s"
              }} />
            </div>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--color-text-secondary)" }}>
              {frame.quota_limit! - frame.download_count} restants / {frame.quota_limit}
            </p>
          </div>
        )}

        <Link href={`/editeur/${frame.id}`} style={{
          marginTop: "auto",
          display: "block",
          textAlign: "center",
          padding: "8px 0",
          fontSize: 13,
          fontWeight: 500,
          borderRadius: 8,
          border: "0.5px solid var(--color-border-secondary)",
          color: "var(--color-text-primary)",
          textDecoration: "none",
        }}>
          Utiliser ce cadre
        </Link>
      </div>
    </div>
  );
}
