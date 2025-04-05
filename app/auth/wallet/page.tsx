'use client';

import { useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CivicAuthProvider } from "@civic/auth-web3/react";
import "@solana/wallet-adapter-react-ui/styles.css";

const WalletPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts
  }, []);

  if (!isClient) {
    return null; // Avoid rendering during server-side rendering
  }

  const endpoint = "https://api.devnet.solana.com"; // Replace with your RPC endpoint

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <CivicAuthProvider clientId="25b8534f-65b4-4cd0-8d2c-76ec66b6ddcd">
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
              <h1 className="text-2xl font-bold mb-4">Solana Wallet with Civic Auth</h1>
              <WalletMultiButton />
              <AppContent />
            </div>
          </CivicAuthProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

// Hook to fetch the wallet's balance
const useBalance = () => {
  const [balance, setBalance] = useState<number>();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useState(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(setBalance);
    }
  }, [connection, publicKey]);

  return balance;
};

// Component to display wallet information
const AppContent = () => {
  const balance = useBalance();
  const { publicKey } = useWallet();

  return (
    <div className="mt-6 text-center">
      {publicKey ? (
        <div>
          <p className="text-lg">Wallet Address: {publicKey.toString()}</p>
          <p className="text-lg">
            Balance: {balance ? `${balance / 1e9} SOL` : "Loading..."}
          </p>
        </div>
      ) : (
        <p className="text-lg">Connect your wallet to see details.</p>
      )}
    </div>
  );
};

export default WalletPage;