import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/quota — vérifie et décrémente le quota d'un cadre
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { frame_id } = await req.json();

  if (!frame_id) {
    return NextResponse.json({ error: "frame_id requis" }, { status: 400 });
  }

  // Récupérer le cadre
  const { data: frame, error } = await supabase
    .from("frames")
    .select("id, quota_limit, download_count, is_public, owner_id")
    .eq("id", frame_id)
    .single();

  if (error || !frame) {
    return NextResponse.json({ error: "Cadre introuvable" }, { status: 404 });
  }

  // Cadres publics gratuits = quota illimité
  if (frame.is_public && frame.quota_limit === null) {
    await incrementDownload(supabase, frame_id);
    return NextResponse.json({ allowed: true, remaining: null });
  }

  // Vérifier le quota
  const remaining = frame.quota_limit! - frame.download_count;
  if (remaining <= 0) {
    return NextResponse.json({
      allowed: false,
      remaining: 0,
      message: "Quota épuisé. L'organisateur doit recharger.",
    });
  }

  await incrementDownload(supabase, frame_id);

  return NextResponse.json({
    allowed: true,
    remaining: remaining - 1,
  });
}

async function incrementDownload(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>, frameId: string) {
  await supabase.rpc("increment_download_count", { frame_id: frameId });
}
