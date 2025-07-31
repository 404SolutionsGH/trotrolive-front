import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export const metadata: Metadata = {
  title: 'TrotroLive - Your Smart Transportation Companion',
  description: 'Find the best routes, track your journey, and contribute to the community.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NuqsAdapter>
          <Providers>
            {children}
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
