export type UserRole = "free" | "organizer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface Frame {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  image_url: string;         // URL du PNG transparent dans Supabase Storage
  thumbnail_url: string;     // Miniature 400x400
  is_public: boolean;        // Visible par tous ou seulement le propriétaire
  category: string | null;   // "événement", "religieux", "sport", etc.
  download_count: number;    // Téléchargements réalisés
  quota_limit: number | null; // null = illimité (cadres publics gratuits)
  active: boolean;
  created_at: string;
  owner?: Profile;
}

export interface FrameUsage {
  id: string;
  frame_id: string;
  user_id: string | null;    // null = visiteur anonyme
  downloaded_at: string;
  ip_hash: string | null;
}

export interface QuotaPackage {
  id: string;
  name: string;              // "Pack 50", "Pack 200", "Pack 500"
  download_limit: number;
  price_xof: number;         // Prix en Francs CFA
  description: string | null;
}

export interface Purchase {
  id: string;
  owner_id: string;
  frame_id: string;
  package_id: string;
  transaction_id: string;    // ID retourné par CinetPay
  amount_xof: number;
  status: "pending" | "completed" | "failed";
  downloads_remaining: number;
  created_at: string;
  package?: QuotaPackage;
  frame?: Frame;
}

export interface EditorState {
  frameUrl: string | null;
  photoUrl: string | null;
  scale: number;
  posX: number;
  posY: number;
  rotation: number;
  brightness: number;
  contrast: number;
  isCircleCrop: boolean;
  flipH: boolean;
  flipV: boolean;
  textOverlay: string;
  textColor: string;
  textSize: number;
}
