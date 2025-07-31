/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from "react";
import { isClient } from "@/lib/utils";
import Cookies from 'js-cookie';
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
import { User, AuthResponse } from "@/app/features/auth/types";

interface LoginCredentials {
  wallet_address: string;
  id_token: string;
}

export default function Login() {
  if (!isClient) {
    return null;
  }

  // Check if Civic client ID is configured
  if (!process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID) {
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
            <CivicAuthProvider clientId={`${process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID}`}>
              <div className="min-h-screen backdrop-brightness-75 flex flex-col items-center justify-center bg-[url(https://i.imgur.com/h6v4f1k.jpg)]">
                <ConnectionRedirect />
              </div>
            </CivicAuthProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  );
}

const ConnectionRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { publicKey } = useWallet();
  const { user, idToken, authStatus: civicStatus } = useUser();

  const {
    isAuthenticated,
    login,
    logout,
    setPublicKey,
  } = useAuthStore();

  const [status, setStatus] = useState<'waiting-wallet' | 'waiting-civic' | 'authenticating' | 'error' | 'success'>('waiting-wallet');
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      console.log('[Login] User already authenticated, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    let timeout: NodeJS.Timeout;
    if (status === 'authenticating') {
      timeout = setTimeout(() => {
        console.log('[Login] Authentication timeout reached');
        setTimeoutReached(true);
        setStatus('error');
      }, 30000); // 30 seconds timeout
    }

    return () => clearTimeout(timeout);
  }, [isAuthenticated, router, status]);

  // Handle wallet connection
  useEffect(() => {
    if (publicKey && !user) {
      console.log('[Login] Wallet connected');
      setStatus('waiting-civic');
      setPublicKey(publicKey.toString());
    }
  }, [publicKey, user, setPublicKey]);

  // Handle Civic authentication
  useEffect(() => {
    if (user && idToken) {
      setStatus('authenticating');
      
      (async () => {
        try {
          console.log('[Civic Login] Wallet connected:', publicKey?.toString());
          console.log('[Civic Login] Civic JWT:', idToken);
          console.log('[Civic Login] Client ID:', process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID);
          console.log('[Civic Login] API URL:', process.env.NEXT_PUBLIC_API_URL);
          
          const response = await authApi.civicAuth(idToken);
          console.log('[Civic Login] Civic Auth API response:', response);
          
          if (response && response.user) {
            console.log('[Civic Login] Authentication successful, setting user data...');
            setPublicKey(publicKey?.toString() || null);
            
            // Convert User type to match auth store User interface
            const authUser = {
              id: String(response.user.id), // Convert number to string
              full_name: response.user.full_name,
              email: response.user.email,
              web3_address: publicKey?.toString()
            };
            
            login(authUser, {
              access: response.access_token,
              refresh: response.refresh_token
            });
            
            setAuthCompleted(true);
            setStatus('success');
            // Redirect after successful authentication
            const redirectPath = searchParams.get('redirect') || '/';
            console.log('[Civic Login] Redirecting to:', redirectPath);
            setTimeout(() => router.push(redirectPath), 500);
          } else {
            console.error('[Civic Login] Invalid response format:', response);
            setStatus('error');
          }
        } catch (err: any) {
          console.error('[Civic Login] Authentication error:', err);
          setStatus('error');
          setError(err.message || 'Authentication failed');
          setTimeout(() => {
            setError(null);
            setStatus('waiting-wallet');
            logout();
          }, 3000);
        }
      })();
    }
  }, [user, idToken, login, logout, router, publicKey, setPublicKey, searchParams]);

  // Clear auth state on component unmount
  useEffect(() => {
    return () => {
      logout();
    };
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8">
          {status === 'waiting-wallet' ? (
            <div className="text-center">
              <p className="text-gray-600">Connect your wallet to continue</p>
              <div className="mt-4">
                <WalletMultiButton className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" />
              </div>
            </div>
          ) : status === 'waiting-civic' ? (
            <div className="text-center">
              <p className="text-gray-600">Please complete your Civic Auth verification</p>
              {civicStatus === 'authenticating' && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </div>
              )}
            </div>
          ) : status === 'authenticating' ? (
            <div className="text-center">
              <p className="text-gray-600">Authenticating with backend...</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              </div>
            </div>
          ) : status === 'success' ? (
            <div className="text-center">
              <p className="text-green-600">Authentication successful!</p>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600">{error || 'Authentication failed'}</p>
              <button
                onClick={() => {
                  setStatus('waiting-wallet');
                  setError(null);
                  logout();
                }}
                className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};