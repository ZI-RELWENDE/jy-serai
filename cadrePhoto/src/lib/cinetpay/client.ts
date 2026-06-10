export interface CinetPayInitParams {
  amount: number;          // Montant en XOF
  currency: "XOF";
  transaction_id: string;  // Unique par transaction
  description: string;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  return_url: string;      // Redirection après paiement
  notify_url: string;      // Webhook Supabase Edge Function
  channels: "ALL";         // Tous les moyens de paiement
}

export interface CinetPayResponse {
  code: string;
  message: string;
  data?: {
    payment_url: string;
    payment_token: string;
  };
}

/**
 * Initialise un paiement CinetPay et retourne l'URL de paiement.
 * À appeler depuis une API Route Next.js (côté serveur uniquement).
 */
export async function initializeCinetPayPayment(
  params: CinetPayInitParams
): Promise<CinetPayResponse> {
  const response = await fetch("https://api-checkout.cinetpay.com/v2/payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: process.env.CINETPAY_API_KEY,
      site_id: process.env.CINETPAY_SITE_ID,
      ...params,
    }),
  });

  if (!response.ok) {
    throw new Error(`CinetPay erreur HTTP: ${response.status}`);
  }

  return response.json();
}

/**
 * Vérifie le statut d'un paiement auprès de CinetPay.
 * Utilisé dans le webhook pour confirmer avant d'activer le quota.
 */
export async function verifyCinetPayPayment(
  transactionId: string,
  token: string
): Promise<{ status: "ACCEPTED" | "REFUSED" | "PENDING"; message: string }> {
  const response = await fetch(
    "https://api-checkout.cinetpay.com/v2/payment/check",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: transactionId,
        token,
      }),
    }
  );

  const data = await response.json();
  return {
    status: data.data?.status ?? "PENDING",
    message: data.message,
  };
}
