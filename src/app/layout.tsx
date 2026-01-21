import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gym-beta-pink.vercel.app'),
  title: {
    default: "Euscaris Pereira | Entrenadora Personal",
    template: "%s | Euscaris Pereira"
  },
  description: "Agenda tu cita de entrenamiento con Euscaris Pereira. Planes personalizados de fitness y transformación corporal.",
  openGraph: {
    title: "Euscaris Pereira | Entrenadora Personal",
    description: "Agenda tu cita de entrenamiento y transforma tu cuerpo con planes personalizados.",
    url: '/',
    siteName: 'Euscaris Pereira',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Euscaris Pereira - Entrenadora Personal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Euscaris Pereira | Entrenadora Personal",
    description: "Agenda tu cita de entrenamiento personal.",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-icon.png',
    },
  },
};

import { Toaster } from "@/components/ui/Toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body suppressHydrationWarning={true}>
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
