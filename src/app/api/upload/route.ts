import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE_MB = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? "5");
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Vérification de la session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const bucket = formData.get("bucket") as string ?? "frames";

  if (!file) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté. PNG, JPEG ou WebP uniquement." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Fichier trop lourd. Maximum ${MAX_SIZE_MB} Mo.` }, { status: 400 });
  }

  const ext = file.type.split("/")[1];
  const filename = `${user.id}/${uuidv4()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return NextResponse.json({ error: "Erreur de stockage" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl, path: filename });
}
