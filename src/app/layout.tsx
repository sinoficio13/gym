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
  metadataBase: new URL('https://gym-instructor-premium.vercel.app'),
  title: {
    default: "Eucaris Pereira | Entrenadora Personal",
    template: "%s | Eucaris Pereira"
  },
  description: "Agenda tu cita de entrenamiento con Eucaris Pereira. Planes personalizados de fitness y transformación corporal.",
  openGraph: {
    title: "Eucaris Pereira | Entrenadora Personal",
    description: "Agenda tu cita de entrenamiento y transforma tu cuerpo con planes personalizados.",
    url: '/',
    siteName: 'Eucaris Pereira',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Eucaris Pereira - Entrenadora Personal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Eucaris Pereira | Entrenadora Personal",
    description: "Agenda tu cita de entrenamiento personal.",
    images: ['/og-image.png'],
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
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          {children}
        </main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
