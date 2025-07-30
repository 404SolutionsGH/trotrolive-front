/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from "react";
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
  const {
    publicKey,
    signMessage,
    signTransaction,
    signAllTransactions,
    wallet,
    connect,
    disconnect,
  } = useWallet();

  const { user, idToken, authStatus: civicStatus } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    isAuthenticated,
    login,
    logout,
    setPublicKey,
  } = useAuthStore();

  const [status, setStatus] = useState<'waiting-wallet' | 'waiting-civic' | 'authenticating' | 'error' | 'success'>('waiting-wallet');
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);

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
  }, [publicKey, user]);

  // Handle Civic Auth completion
  useEffect(() => {
    if (user && idToken) {
      console.log('[Login] Civic Auth completed');
      setStatus('authenticating');
      
      // Send auth data to backend
      authApi.login({
        wallet_address: publicKey.toString(),
        id_token: idToken,
      })
      .then((response: AuthResponse) => {
        console.log('[Login] Backend auth response:', response);
        setStatus('success');
        
        // Store auth data
        login({
          ...response.user,
          id: response.user.id.toString()
        }, {
          access: response.access_token,
          refresh: response.refresh_token
        });
        
        // Check user role and redirect accordingly
        if (response.user) {
          switch (response.user.role) {
            case 'admin':
              router.push('/dashboard/admin');
              break;
            case 'driver':
              router.push('/dashboard/driver');
              break;
            default:
              router.push('/dashboard');
          }
        } else {
          setError('Invalid user data received');
          setStatus('error');
        }
      })
      .catch((err: ApiError) => {
        console.error('[Login] Auth error:', err);
        setStatus('error');
        setError(err.message || 'Authentication failed');
        setTimeout(() => {
          setError(null);
          setStatus('waiting-wallet');
          logout();
        }, 3000);
      });
    }
  }, [user, idToken, login, logout, router, publicKey]);

  // Clear auth state on component unmount
  useEffect(() => {
    return () => {
      logout();
    };
  }, []);

  return (
    <ConnectionProvider endpoint="https://api.mainnet-beta.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId={`${process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID}`}>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}