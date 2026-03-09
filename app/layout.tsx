import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "Mare Nostrum — Ristorante di Pesce",
  description: "Ristorante di pesce con cucina tradizionale e innovativa. Prenota il tuo tavolo, ordina online e scopri i nostri piatti signature. Il meglio del mare sulla tua tavola.",
  keywords: "ristorante pesce, ristorante mare, pesce fresco, cucina marinara, prenota tavolo, ordina online",
  openGraph: {
    title: "Mare Nostrum — Ristorante di Pesce",
    description: "La tradizione del mare incontra l'innovazione culinaria. Prenota il tuo tavolo oggi.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-theme="dark">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh' }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
