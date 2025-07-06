/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRouter } from "next/navigation";
import { CreditCard, MapPin, Send, PlusCircle, Wallet } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/app/features/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "@civic/auth/react";
import React from "react";
import { mockTransactions, mockWallets } from "@/data/wallet-mock-data";

interface Wallet {
  id: string;
  type: string; // 'native' or 'crypto'
  balance: number;
  address: string; // phone number for native, wallet address for crypto
}

interface Transaction {
  id: number;
  amount: string;
  transaction_type: string;
  description: string;
  created_at: string;
  wallet_type: string; // 'native' or 'crypto'
}

export default function Admin() {
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWalletType, setActiveWalletType] = useState<string>('native');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fullName, setFullName] = useState("John");
  const [isClient, setIsClient] = useState(false);
  const solanaWallet = useWallet();
  const { user } = useUser()

  // Helper function to truncate addresses
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Initialize with mock data if no real data is available
  useEffect(() => {
    setIsClient(true);
    dispatch(checkAuth());
    
    // Fetch real data first, if it fails use mock data
    fetchWalletData();
    fetchTransactions();

    // Get user info
    const storedName = localStorage.getItem("user");
    if (storedName) {
      const userName = user?.name
      setFullName(`${userName}`);
    } else {
      setFullName("John Doe"); // Default mock name
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user?.name]);

  const useBalance = () => {
    const [balance, setBalance] = useState<number>();
    const { connection } = useConnection();
    const { publicKey } = useWallet();
  
    React.useEffect(() => {
      if (publicKey) {
        connection.getBalance(publicKey).then(setBalance);
      }
    }, [publicKey, connection]);
  
    return balance;
  };

  const fetchWalletData = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");
    const publicKey = isClient ? solanaWallet.publicKey : null;
    const cryptoAddress = publicKey ? publicKey.toString() : "0x1234...5678";

    try {
      const response = await fetch("https://api.trotro.live/trotro-pay/wallet/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the API response
        setWallets([
          {
            id: data.native_wallet?.id || "native-1",
            type: 'native',
            balance: data.native_wallet?.balance || 0,
            address: data.native_wallet?.phone_number || "0241234567",
          },
          {
            id: data.crypto_wallet?.id || "crypto-1",
            type: 'crypto',
            balance: data.crypto_wallet?.balance || 0,
            address: data.crypto_wallet?.address || cryptoAddress,
          }
        ]);
      } else {
        // If API fails, use mock data with the actual public key for crypto wallet if available
        setWallets([
          mockWallets[0],
          {
            ...mockWallets[1],
            address: cryptoAddress
          }
        ]);
        console.log("Using mock wallet data");
      }
    } catch (err) {
      console.error(err);
      // Use mock data on error with the actual public key for crypto wallet if available
      setWallets([
        mockWallets[0],
        {
          ...mockWallets[1],
          address: cryptoAddress
        }
      ]);
      console.log("Using mock wallet data due to error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");

    try {
      const response = await fetch("https://api.trotro.live/trotro-pay/wallet/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      } else {
        // Use mock transactions if API fails
        setTransactions(mockTransactions);
        console.log("Using mock transaction data");
      }
    } catch (err) {
      console.error(err);
      // Use mock transactions on error
      setTransactions(mockTransactions);
      console.log("Using mock transaction data due to error");
    } finally {
      setLoading(false);
    }
  };

  // Create wallet only if not already existing
  const createWallet = async () => {
    if (wallets.length > 0) {
      toast.info("You already have wallets!");
      return;
    }

    const token = Cookies.get("access_token");
    setLoading(true);

    try {
      const response = await fetch("https://api.trotro.live/trotro-pay/wallet/", {
        method: "POST", // Changed to POST for creation
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data = await response.json();
        // Update with real data or fall back to mock
        fetchWalletData();
        toast.success("Wallets created successfully!");
        
        // Redirect to fund wallet page
        router.push("/admin/fund");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to create wallets");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get the active wallet
  const activeWallet = wallets.find(wallet => wallet.type === activeWalletType) || wallets[0];

  // Display truncated address for better UI
  const displayAddress = activeWallet?.address 
    ? (activeWalletType === 'crypto' ? truncateAddress(activeWallet.address) : activeWallet.address)
    : "No wallet address";

    const balance = useBalance();
    balance?.toString()

  return (
    <main className="p-6 relative mb-14">
      {/* Position the ToastContainer properly */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2 className="mb-6 text-2xl font-semibold text-[#B4257A]">Dashboard</h2>

      <div className="mb-8 flex items-center justify-between">
        <Button
          className="bg-[#B4257A] text-white"
          onClick={createWallet}
          disabled={wallets.length > 0 || loading}
        >
          {loading ? "Creating..." : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Wallets
            </>
          )}
        </Button>
      </div>

      {/* Wallet Tabs */}
      {wallets.length > 0 && (
        <div className="mb-4 flex gap-4">
          <Button 
            variant={activeWalletType === 'native' ? "default" : "outline"}
            onClick={() => setActiveWalletType('native')}
            className={activeWalletType === 'native' ? "bg-[#b4257a] hover:bg-[#b4257a]" : ""}
          >
            Native Wallet
          </Button>
          <Button 
            variant={activeWalletType === 'crypto' ? "default" : "outline"}
            onClick={() => setActiveWalletType('crypto')}
            className={activeWalletType === 'crypto' ? "bg-[#B4257A]" : ""}
          >
            Crypto Wallet
          </Button>
        </div>
      )}

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#B4257A] p-2">
                {activeWalletType === 'native' ? (
                  <CreditCard className="h-5 w-5 text-white" />
                ) : (
                  <Wallet className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-lg text-muted-foreground">
                {displayAddress}
              </span>
            </div>
            <div className="text-4xl font-bold">
              {activeWallet 
                ? `${activeWalletType === 'native' ? 'GH₵' : 'SOL'} ${activeWallet.balance}` 
                : "No wallet available"
              }
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Button className="flex h-auto flex-col items-center justify-center gap-2 bg-white p-6 text-[#B4257A] hover:bg-white/90">
            <Send className="h-10 w-10" />
            <span>PAY</span>
          </Button>
          <Button 
            className="flex h-auto flex-col items-center justify-center gap-2 bg-white p-6 text-[#B4257A] hover:bg-white/90"
            onClick={() => router.push("/admin/deposit")}
          >
            <CreditCard className="h-10 w-10" />
            <span className=''>FUND</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Transaction History</h3>
          </div>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-t p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-2 w-2 translate-y-2 rounded-full ${
                      transaction.transaction_type === "DEPOSIT" ? "bg-green-500" : "bg-[#B4257A]"
                    }`}
                  />
                  <div>
                    <div className="font-medium">{transaction.transaction_type}</div>
                    <div className="text-sm text-muted-foreground">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.wallet_type === 'native' ? 'Native Wallet' : 'Crypto Wallet'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="text-right">
                    <div className={`font-medium ${transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
                      {transaction.amount.startsWith("-") 
                        ? transaction.amount 
                        : `+${transaction.wallet_type === 'native' ? 'GH₵' : 'SOL'} ${transaction.amount}`
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">No transactions available.</div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}