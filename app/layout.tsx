import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/react-query-provider";
import { Providers } from "@/components/realtime-provider";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: 'DropTime Chat | Secure Ephemeral Rooms',
  description: 'Self-destructing, 2-participant private chat rooms with Neo-brutalist design. Real-time, secure, and ephemeral.',
  keywords: ['Ephemeral Chat', 'Secure Messaging', 'Neo-brutalist UI', 'Privacy', 'Real-time Chat'],
  authors: [{ name: 'Golam Morshed' }],
  
  // OpenGraph (Facebook, LinkedIn, Discord)
  openGraph: {
    title: 'DropTime Chat: Private, Ephemeral Messaging',
    description: 'Secure 2-participant rooms with a 20-minute lifespan. Bold design, instant synchronization, and zero data persistence.',
    url: 'https://droptime-chat.vercel.app',
    siteName: 'DropTime Chat',
    images: [
      {
        url: '/openGraph-image.png',
        alt: 'DropTime Chat Neo-brutalist Interface Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: 'DropTime Chat | Secure Ephemeral Rooms',
    description: '20-minute TTL rooms. 2-participant limit. Powered by Redis and Realtime Synchronization.',
    images: ['/openGraph-image.png'],
  },

  // Standard Robots and Icons
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
