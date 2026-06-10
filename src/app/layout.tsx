import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jy Serai - Cadres evenementiels",
  description: "Cree ton visuel evenementiel en 30 secondes",
  icons: {
    icon: "/jy_serai.png",
    apple: "/jy_serai.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/jy_serai.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}