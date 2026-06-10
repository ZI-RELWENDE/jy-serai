# CadrePhoto — Plateforme de cadres événementiels

Générateur de visuels « J'y serai » pour événements.
Stack : **Next.js 14** · **Supabase** · **CinetPay** · **TypeScript**

---

## Démarrage rapide

### 1. Cloner et installer
```bash
git clone <ton-repo>
cd cadrePhoto
npm install
```

### 2. Variables d'environnement
Copier `.env.local` et remplir :
```env
NEXT_PUBLIC_SUPABASE_URL=https://TON_PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_clé_publique
CINETPAY_API_KEY=ta_clé_cinetpay
CINETPAY_SITE_ID=ton_site_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Base de données Supabase
Dans le dashboard Supabase → SQL Editor, coller et exécuter :
```
supabase/migrations/001_schema.sql
```

### 4. Lancer en développement
```bash
npm run dev
```

---

## Structure du projet

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          — Page connexion
│   │   └── register/       — Page inscription
│   ├── (dashboard)/
│   │   ├── dashboard/      — Vue d'ensemble organisateur
│   │   ├── mes-cadres/     — Liste des cadres créés
│   │   ├── nouveau-cadre/  — Formulaire création de cadre
│   │   └── abonnement/     — Achat de quotas
│   ├── editeur/[frameId]/  — Éditeur photo principal
│   ├── cadre/[frameId]/    — Page publique d'un cadre
│   └── api/
│       ├── upload/         — Upload vers Supabase Storage
│       ├── frames/         — CRUD des cadres
│       ├── quota/          — Vérification et décrément quota
│       └── payment/cinetpay/ — Initialisation paiement
├── components/
│   ├── editor/
│   │   ├── EditorCanvas.tsx    — Canvas de composition
│   │   └── AdjustmentPanel.tsx — Sliders & contrôles
│   ├── frames/
│   │   └── FrameCard.tsx       — Carte cadre galerie
│   ├── ui/                     — Composants génériques
│   └── layout/                 — Header, Footer, Nav
├── lib/
│   ├── supabase/
│   │   ├── client.ts   — Client navigateur
│   │   └── server.ts   — Client serveur (RSC)
│   ├── cinetpay/
│   │   └── client.ts   — API CinetPay
│   └── canvas/
│       └── renderer.ts — Moteur de composition PNG
├── store/
│   └── editorStore.ts  — État global Zustand
├── types/
│   └── index.ts        — Types TypeScript
└── hooks/              — Custom React hooks
```

---

## Modèle de données (Supabase)

| Table            | Rôle |
|------------------|------|
| `profiles`       | Utilisateurs (extension auth.users) |
| `frames`         | Cadres PNG avec quotas |
| `quota_packages` | Packs achetables (50/200/500 DL) |
| `purchases`      | Transactions CinetPay |

---

## Flux de paiement

1. Organisateur choisit un cadre + un pack
2. `POST /api/payment/cinetpay` → reçoit `payment_url`
3. Redirection vers CinetPay (Orange Money, Moov, Wave, Carte)
4. CinetPay appelle le webhook `/api/payment/cinetpay/webhook`
5. Le trigger SQL `on_purchase_completed` augmente le quota du cadre

---

## Déploiement

```bash
# Vercel (recommandé)
npx vercel deploy

# Ou build local
npm run build && npm start
```

Ajouter les variables d'env dans le dashboard Vercel.

---

## Prochaines étapes (V2)

- [ ] Détection automatique du visage (face-api.js)
- [ ] Partage direct WhatsApp / Facebook depuis l'éditeur
- [ ] Lien de cadre partageable (QR code)
- [ ] Tableau de bord analytics organisateur
- [ ] Suppression de fond (remove.bg API)
