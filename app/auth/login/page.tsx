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
  const maxRetries = 3;

  // Timeout to prevent infinite spinner
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAuthenticating) {
      timeout = setTimeout(() => {
        console.log('[Login] Authentication timeout reached');
        setTimeoutReached(true);
        setStatus('error');
        setError('Authentication timed out. Please try again.');
        setIsAuthenticating(false);
        authAttempted.current = false;
      }, 30000); // 30s timeout
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
        console.log('[Civic Login] Starting authentication process');
        console.log('[Civic Login] Wallet connected:', publicKey?.toString());
        console.log('[Civic Login] Civic JWT present:', !!idToken);
        
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
        
        // Add retry logic
        let lastError: any = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`[Civic Login] Authentication attempt ${attempt}/${maxRetries}`);
            
            const response = await authApi.civicAuth(idToken, displayMode);
            console.log('[Civic Login] Civic Auth API response received');
            
            if (response.tokens && response.user) {
              setPublicKey(publicKey?.toString() || null);
              login(response.user, response.tokens);
              setAuthCompleted(true);
              setStatus('success');
              
              console.log('[Civic Login] Authentication successful');
              
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
                console.log('[Civic Login] Redirecting to:', redirectPath);
                setTimeout(() => router.push(redirectPath), 500);
              }
              
              return; // Success, exit retry loop
            } else {
              throw new Error('Invalid response format from authentication server');
            }
          } catch (err) {
            lastError = err;
            console.error(`[Civic Login] Attempt ${attempt} failed:`, err);
            
            if (attempt < maxRetries) {
              console.log(`[Civic Login] Retrying in 2 seconds...`);
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        // All retries failed
        setStatus('error');
        if (lastError instanceof ApiError) {
          setError(`Authentication failed: ${lastError.message}`);
        } else {
          setError('Authentication failed after multiple attempts. Please try again.');
        }
        authAttempted.current = false;
        
      } catch (err) {
        console.error('[Civic Login] Unexpected error:', err);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E] mb-4"></div>
          <p className="text-lg text-gray-600">Authenticating with Civic...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'authenticating') {
    return (
      <div className="mt-6 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6246E] mb-4"></div>
          <p className="text-lg text-gray-600">
            {timeoutReached ? 'Authentication timed out' : 'Authenticating...'}
          </p>
          {timeoutReached && (
            <p className="text-sm text-gray-500 mt-2">Please try again</p>
          )}
        </div>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="mt-6 text-center">
        <div className="text-green-500 mb-4">
          <p>Authentication successful!</p>
        </div>
      </div>
    );
  }

  return null;
};

export default WalletPage;