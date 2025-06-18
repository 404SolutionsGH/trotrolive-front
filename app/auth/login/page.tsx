/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from "react";
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
import { authApi, ApiError } from "@/app/features/auth/api";

const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) {
    return null;
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
  const { user, idToken } = useUser();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authAttempted = useRef(false);

  useEffect(() => {
    const authenticateWithCivic = async () => {
      if (!publicKey || !idToken || isAuthenticating || authCompleted || authAttempted.current) {
        return;
      }

      console.log("Wallet connected:", publicKey?.toString());
      console.log("Civic JWT:", idToken);

      authAttempted.current = true;
      setIsAuthenticating(true);
      setError(null);

      try {
        const response = await authApi.civicAuth(idToken);
        console.log("Civic Auth API response:", response);

        // Store tokens if present
        if (response.tokens) {
          Cookies.set("access_token", response.tokens.access, { path: "/" });
          Cookies.set("refresh_token", response.tokens.refresh, { path: "/" });
        }

        setAuthCompleted(true);
        
        // Redirect after successful authentication
        const redirectPath = searchParams.get("redirect") || "/";
        router.push(redirectPath);
        
      } catch (err) {
        console.error("Civic authentication failed:", err);
        
        // Handle different types of errors
        if (err instanceof ApiError) {
          setError(`Authentication failed: ${err.message}`);
        } else {
          setError("An unexpected error occurred during authentication");
        }
        
        // Reset states on error to allow retry
        authAttempted.current = false;
        setIsAuthenticating(false);
      }
    };

    authenticateWithCivic();
  }, [publicKey, idToken, isAuthenticating, authCompleted, router, searchParams]);

  if (error) {
    return (
      <div className="mt-6 text-center">
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => {
            setError(null);
            authAttempted.current = false;
            setAuthCompleted(false);
          }}
          className="px-4 py-2 bg-[#D6246E] text-white rounded hover:bg-[#B71C5A]"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 text-center">
      {publicKey ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E]"></div>
          <p className="text-lg mt-4">
            {isAuthenticating ? "Authenticating..." : "Wallet connected! Authenticating..."}
          </p>
        </div>
      ) : (
        <p className="text-lg text-gray-600 mt-4">Connect your wallet to continue.</p>
      )}
    </div>
  );
};

export default WalletPage;