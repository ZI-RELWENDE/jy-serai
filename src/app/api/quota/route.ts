import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { frame_id } = await req.json();

  if (!frame_id) {
    return NextResponse.json({ error: "frame_id requis" }, { status: 400 });
  }

  const { data: frame, error } = await supabase
    .from("frames")
    .select("id, active, expires_at, has_watermark, is_public")
    .eq("id", frame_id)
    .single();

  if (error || !frame) {
    return NextResponse.json({ error: "Cadre introuvable" }, { status: 404 });
  }

  if (!frame.active) {
    return NextResponse.json({ allowed: false, message: "Ce cadre est desactive." }, { status: 403 });
  }

  if (frame.expires_at && new Date(frame.expires_at) < new Date()) {
    return NextResponse.json({
      allowed: false,
      message: "Le forfait de ce cadre a expire. L organisateur doit renouveler.",
    }, { status: 403 });
  }

  await supabase.rpc("increment_download_count", { frame_id });

  return NextResponse.json({
    allowed: true,
    has_watermark: frame.has_watermark,
    expires_at: frame.expires_at,
  });
}