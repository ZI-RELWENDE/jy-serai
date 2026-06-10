import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeCinetPayPayment } from "@/lib/cinetpay/client";
import { v4 as uuidv4 } from "uuid";

// POST /api/payment/cinetpay — initialise un achat de quota
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { frame_id, package_id, phone } = body;

  // Récupérer le pack choisi
  const { data: pkg } = await supabase
    .from("quota_packages")
    .select("*")
    .eq("id", package_id)
    .single();

  if (!pkg) {
    return NextResponse.json({ error: "Pack introuvable" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const transactionId = uuidv4();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // Enregistrer la transaction en attente
  await supabase.from("purchases").insert({
    owner_id: user.id,
    frame_id,
    package_id,
    transaction_id: transactionId,
    amount_xof: pkg.price_xof,
    status: "pending",
    downloads_remaining: 0,
  });

  const result = await initializeCinetPayPayment({
    amount: pkg.price_xof,
    currency: "XOF",
    transaction_id: transactionId,
    description: `Quota ${pkg.name} — ${pkg.download_limit} téléchargements`,
    customer_name: profile?.full_name ?? "Client",
    customer_email: profile?.email ?? user.email ?? "",
    customer_phone_number: phone ?? "",
    return_url: `${appUrl}/dashboard/mes-cadres?paid=1`,
    notify_url: `${appUrl}/api/payment/cinetpay/webhook`,
    channels: "ALL",
  });

  if (result.code !== "201") {
    return NextResponse.json({
      error: `CinetPay: ${result.message}`,
    }, { status: 502 });
  }

  return NextResponse.json({
    payment_url: result.data!.payment_url,
    transaction_id: transactionId,
  });
}
