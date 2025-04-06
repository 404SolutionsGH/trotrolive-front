import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from './providers';
import "./globals.css";
import Layout from "./wallet-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Trotro Live | Your Source for Ghana Trotro Transportation Information",
  description: "TrotroLive provides comprehensive trotro transportation information, including trotro fares, routes, and real-time updates. Discover the world of Troski with TrotroLive.",
  keywords: ['Trotro', 'TrotroLive', 'Troski', 'trotroDiaries', 'Trotro fares', 'trotro info', 'Ghana Trotro', 'trosky'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
