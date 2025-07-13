/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from "react";
import { clearAllAuthState } from "@/app/lib/store/authUtils";
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

const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  useEffect(() => {
    // Enhanced state clearing to prevent auth state persistence issues
    const clearState = async () => {
      console.log('[Login] Clearing authentication state...');
      
      // Clear all auth state in localStorage and cookies
      clearAllAuthState();
      
      // Additional cleanup specific to Civic auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('civic_jwt');
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('notification-storage');
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        Cookies.remove('csrftoken', { path: '/' });
      }
      
      setIsClient(true);
      console.log('[Login] Authentication state cleared successfully');
    };
    
    clearState();
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
    
    // Reset any previous state
    setStatus('authenticating');
    setIsAuthenticating(true);
    setError(null);
    authAttempted.current = true;
    setTimeoutReached(false);
    
    // Clear any existing authentication state to ensure a clean start
    if (typeof window !== 'undefined') {
      Cookies.remove('access_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      localStorage.removeItem('civic_jwt');
    }

    (async () => {
      try {
        console.log('[Civic Login] Wallet connected:', publicKey?.toString());
        console.log('[Civic Login] Civic JWT:', idToken);
        
        // Extract display mode from state parameter if present
        const stateParam = searchParams.get('state');
        let displayMode = 'default';
        
        if (stateParam) {
          try {
            const decodedState = JSON.parse(atob(stateParam));
            displayMode = decodedState.displayMode || 'default';
          } catch (e) {
            console.error('[Civic Login] Failed to parse state parameter:', e);
          }
        }
        
        console.log('[Civic Login] Using display mode:', displayMode);
        const response = await authApi.civicAuth(idToken, displayMode);
        console.log('[Civic Login] Civic Auth API response:', response);
        if (response.tokens && response.user) {
          setPublicKey(publicKey?.toString() || null);
          login(response.user, response.tokens);
          setAuthCompleted(true);
          setStatus('success');
          // Redirect after successful authentication
          // Extract display mode from state parameter if present
          const stateParam = searchParams.get('state');
          let displayMode = 'default';
          
          if (stateParam) {
            try {
              const decodedState = JSON.parse(atob(stateParam));
              displayMode = decodedState.displayMode || 'default';
            } catch (e) {
              console.error('[Civic Login] Failed to parse state parameter:', e);
            }
          }
          
          console.log('[Civic Login] Display mode:', displayMode);
          
          // Handle iframe display mode differently to prevent automatic logout
          if (displayMode === 'iframe') {
            // For iframe mode, use a different approach to prevent token loss
            // Set a flag indicating successful authentication
            window.localStorage.setItem('auth_completed', 'true');
            
            // Use postMessage to communicate with parent frame if needed
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'CIVIC_AUTH_SUCCESS',
                user: response.user
              }, '*');
            }
            
            // Don't redirect in iframe mode, as it can cause session loss
            console.log('[Civic Login] Authentication successful in iframe mode');
          } else {
            // Normal redirect for non-iframe mode
            const redirectPath = searchParams.get('redirect') || '/';
            setTimeout(() => router.push(redirectPath), 500);
          }
        } else {
          setStatus('error');
          setError('Unexpected response from authentication server.');
        }
      } catch (err) {
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