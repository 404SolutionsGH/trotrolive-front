import { Providers } from './providers';
import { AuthWrapper } from '@/components/layout/auth-wrapper';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'TrotroLive',
  description: 'Your trusted transport companion',
};
