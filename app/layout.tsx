import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from './providers'
import {
  ClerkProvider,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TuroRentals | Find your perfect car",
  description: "Find your perfect car on Turo, the world's largest car sharing marketplace.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://turo-rentals.vercel.app/",
    title: "TuroRentals | Find your perfect car",
    description: "Find your perfect car on Turo, the world's largest car sharing marketplace.",
    images: [
      {
        url: "https://turo-rentals.vercel.app/corvette.jpg ",
        width: 1200,
        height: 630,
        alt: "TuroRentals | Find your perfect car",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider >
          <Providers>
            <Navbar />
            <main className="container py-10">{children}</main>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
