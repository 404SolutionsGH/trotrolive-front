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

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;
  const endpoint = "https://api.mainnet-beta.solana.com";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid hydration mismatch
  if (!isClient) {
    return <div className="min-h-screen bg-gray-100"></div>;
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={`${clientId}`}>
            <div className="min-h-screen flex flex-col">
              {/* Header */}
              <SiteHeader />

              {/* Main Content */}
              <main className="flex-1">{children}</main>
            </div>
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}