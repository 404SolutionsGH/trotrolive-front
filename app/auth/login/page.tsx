/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { authApi, ApiError } from "@/app/features/auth/api";
import { useAuthStore } from "@/lib/auth-store";

const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) {
    return null;
  }

  // Check if Civic client ID is configured
  if (!clientId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[url(https://i.imgur.com/h6v4f1k.jpg)]">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            Civic Client ID is not configured. Please set the NEXT_PUBLIC_CIVIC_CLIENT_ID environment variable.
          </p>
          <p className="text-sm text-gray-500">
            Create a .env.local file with: NEXT_PUBLIC_CIVIC_CLIENT_ID=your_client_id_here
          </p>
        </div>
      </div>
    );
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

  const setPublicKey = useAuthStore((state: any) => state.setPublicKey);
  const login = useAuthStore((state: any) => state.login);

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'waiting-wallet' | 'waiting-civic' | 'authenticating' | 'success' | 'error'>('waiting-wallet');
  const [timeoutReached, setTimeoutReached] = useState(false);
  const authAttempted = useRef(false);
  const retryCount = useRef(0);

  // Timeout to prevent infinite spinner
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAuthenticating) {
      timeout = setTimeout(() => {
        setTimeoutReached(true);
        setStatus('error');
        setError('Authentication timed out. Please try again.');
        setIsAuthenticating(false);
        authAttempted.current = false;
      }, 15000); // 15s timeout
    }
    return () => clearTimeout(timeout);
  }, [isAuthenticating]);

  useEffect(() => {
    if (!publicKey) {
      setStatus('waiting-wallet');
      return;
    }
    if (!idToken) {
      setStatus('waiting-civic');
      return;
    }
    if (isAuthenticating || authCompleted || authAttempted.current) {
      return;
    }
    setStatus('authenticating');
    setIsAuthenticating(true);
    setError(null);
    authAttempted.current = true;
    setTimeoutReached(false);

    (async () => {
      try {
        console.log('[Civic Login] Wallet connected:', publicKey?.toString());
        console.log('[Civic Login] Civic JWT:', idToken);
        console.log('[Civic Login] Client ID:', process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID);
        console.log('[Civic Login] API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        const response = await authApi.civicAuth(idToken);
        console.log('[Civic Login] Civic Auth API response:', response);
        
        if (response.tokens && response.user) {
          console.log('[Civic Login] Authentication successful, setting user data...');
          setPublicKey(publicKey?.toString() || null);
          login(response.user, response.tokens);
          setAuthCompleted(true);
          setStatus('success');
          // Redirect after successful authentication
          const redirectPath = searchParams.get('redirect') || '/';
          console.log('[Civic Login] Redirecting to:', redirectPath);
          setTimeout(() => router.push(redirectPath), 500);
        } else {
          console.error('[Civic Login] Invalid response format:', response);
          setStatus('error');
          setError('Unexpected response from authentication server.');
        }
      } catch (err) {
        console.error('[Civic Login] Authentication error:', err);
        setStatus('error');
        if (err instanceof ApiError) {
          setError(`Authentication failed: ${err.message}`);
        } else {
          setError('An unexpected error occurred during authentication');
        }
        authAttempted.current = false;
      } finally {
        setIsAuthenticating(false);
      }
    })();
  }, [publicKey, idToken, isAuthenticating, authCompleted, router, searchParams, setPublicKey, login]);

  // UI rendering
  if (status === 'error' && error) {
    return (
      <div className="mt-6 text-center">
        <div className="text-red-500 mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            setStatus(publicKey ? (idToken ? 'authenticating' : 'waiting-civic') : 'waiting-wallet');
            setAuthCompleted(false);
            setIsAuthenticating(false);
            setTimeoutReached(false);
            authAttempted.current = false;
            retryCount.current++;
          }}
          className="px-4 py-2 bg-[#D6246E] text-white rounded hover:bg-[#B71C5A]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'waiting-wallet') {
    return (
      <div className="mt-6 text-center">
        <p className="text-lg text-gray-600 mt-4">Connect your wallet to continue.</p>
      </div>
    );
  }
  if (status === 'waiting-civic') {
    return (
      <div className="mt-6 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E]"></div>
          <p className="text-lg mt-4">Waiting for Civic authentication...</p>
        </div>
      </div>
    );
  }
  if (status === 'authenticating') {
    return (
      <div className="mt-6 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E]"></div>
          <p className="text-lg mt-4">Authenticating with Civic...</p>
        </div>
      </div>
    );
  }
  if (status === 'success') {
    return (
      <div className="mt-6 text-center">
        <div className="text-green-600 mb-4">
          <p>Authentication successful! Redirecting...</p>
        </div>
      </div>
    );
  }
  // fallback
  return null;
};

export default WalletPage;