'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CivicAuthProvider, useUser } from "@civic/auth-web3/react";
import "@solana/wallet-adapter-react-ui/styles.css";
import Cookies from 'js-cookie';
import { axiosInstance } from "@/app/lib/store/axios";

// Main component wrapper
const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  useEffect(() => {
    setIsClient(true); 
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
              <div className="min-h-screen flex brightness-50 flex-col items-center justify-center bg-[url(https://i.imgur.com/h6v4f1k.jpg)]">
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
  const searchParams = useSearchParams();
  const { publicKey } = useWallet();
  const { user, idToken } = useUser(); // Get user info and Civic JWT

  useEffect(() => {
    const authenticateWithCivic = async () => {
      if (publicKey && idToken) {
        try {
          // Send JWT to backend
          const response = await axiosInstance.post("/accounts/api/login/", {
            civic_token: idToken,
          });

          Cookies.set("access_token", response.data.tokens.access, { path: "/" });
          Cookies.set("refresh_token", response.data.tokens.refresh, { path: "/" });
          localStorage.setItem("user", JSON.stringify(response.data.user));

          const redirectPath = searchParams.get("redirect") || "/";
          router.push(redirectPath);
        } catch (err) {
          console.error("Civic login failed:", err);
        }
      }
    };
    authenticateWithCivic();
  }, [publicKey, idToken, router, searchParams]);

  return (
    <div className="mt-6 text-center">
      {publicKey ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E]"></div>
          <p className="text-lg mt-4">Wallet connected! Authenticating...</p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 mt-4">Connect your wallet to continue.</p>
      )}
    </div>
  );
};

export default WalletPage;