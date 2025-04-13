'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  // useConnection,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import "@solana/wallet-adapter-react-ui/styles.css";

// Main component wrapper
const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts
  }, []);

  if (!isClient) {
    return null; // Avoid rendering during server-side rendering
  }

  const endpoint = "https://api.devnet.solana.com";

  return (
    <main className="overflow-x-hidden overflow-y-hidden">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <CivicAuthProvider clientId={`${clientId}`}>
              <div className="min-h-screen brightness-50 flex flex-col items-center justify-center bg-[url(https://i.imgur.com/h6v4f1k.jpg)]">
                <h1 className="text-2xl font-bold mb-4">Connect your wallet</h1>
                <p className="text-gray-600 mb-6">Connect your Solana wallet to continue</p>
                <WalletMultiButton />
                <ConnectionRedirect />
              </div>
            </CivicAuthProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
    
  );
};

const ConnectionRedirect = () => {
  const router = useRouter();
  const { publicKey } = useWallet();
  
  useEffect(() => {
    if (publicKey) {
      const redirectTimer = setTimeout(() => {
        router.push('/dashboard/admin');
      }, 1000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [publicKey, router]);

  return (
    <div className="mt-6 text-center">
      {publicKey ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E]"></div>
          <p className="text-lg mt-4">Wallet connected! Redirecting to home page...</p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 mt-4">Connect your wallet to continue.</p>
      )}
    </div>
  );
};

export default WalletPage;