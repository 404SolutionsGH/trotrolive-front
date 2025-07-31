'use client';

import { useState, useEffect } from "react";
import { CivicAuthProvider } from "@civic/auth/react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { SiteHeader } from "@/components/site-header";
import { usePathname } from "next/navigation";
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './features/auth/authSlice';
import { AppDispatch } from './lib/store';
// import { SiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;
  const endpoint = "https://api.mainnet-beta.solana.com";
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  // For SSR/CSR compatibility, fallback to usePathname if available
  // const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication status on app startup, but handle errors gracefully
  useEffect(() => {
    if (isClient) {
      // Only check auth if we're not on an auth route to prevent redirects
      const isAuthRoute = pathname?.startsWith('/auth');
      if (!isAuthRoute) {
        dispatch(checkAuthStatus()).catch((error) => {
          console.error('Auth check failed on startup (likely CORS issue):', error);
          // Don't redirect on CORS errors, let user handle it
        });
      }
    }
  }, [isClient, dispatch, pathname]);

  // Avoid hydration mismatch
  if (!isClient) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={`${clientId}`}>
            <div className="min-h-screen flex flex-col">
              {/* Header */}
              {/* {!isDashboard && <SiteHeader />} */}

              {/* Main Content */}
              <main className="flex-1">{children}</main>
            </div>
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}