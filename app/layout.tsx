import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Inov Consulting — Connexion",
  description: "Plateforme d'assistant IA pour les décideurs — Inov Consulting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
