import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/frames — liste publique ou filtrée
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const ownerId = searchParams.get("owner_id");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = (page - 1) * limit;

  let query = supabase
    .from("frames")
    .select("*, owner:profiles(id, full_name, email)", { count: "exact" })
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (ownerId) {
    query = query.eq("owner_id", ownerId);
  } else {
    query = query.eq("is_public", true);
  }

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ frames: data, total: count, page, limit });
}

// POST /api/frames — créer un cadre
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, image_url, thumbnail_url, is_public, category, quota_limit } = body;

  if (!title || !image_url) {
    return NextResponse.json({ error: "Titre et image requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("frames")
    .insert({
      owner_id: user.id,
      title,
      description,
      image_url,
      thumbnail_url: thumbnail_url ?? image_url,
      is_public: is_public ?? true,
      category,
      quota_limit: is_public ? null : (quota_limit ?? 50),
      download_count: 0,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ frame: data }, { status: 201 });
}
