"use client"

import { useRouter } from "next/navigation";
import { CreditCard, MapPin, Send, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '@/app/features/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';

interface Wallet {
  id: string;
  balance: number;
}

interface Transaction {
  id: number;
  amount: string;
  transaction_type: string;
  description: string;
  created_at: string;
}

export default function Admin() {

  const router = useRouter();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const token = Cookies.get("access_token");

    try {
      const response = await fetch("http://localhost:8000/trotro-pay/wallet/", {
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
        toast.error("Failed to fetch transactions.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check wallet balance
  const checkWalletBalance = async () => {
    const token = Cookies.get("access_token");
    const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

    try {
      const response = await fetch(
        `http://localhost:8000/trotro-pay/wallet-balance/${userId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWallet({ id: data.user_id, balance: data.balance });
      } else {
        setWallet(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching wallet balance.");
    }
  };

  // Create wallet only if not already existing
  const createWallet = async () => {

    if (wallet) {
      toast.info("You already have a wallet!");
      return;
    }

    const token = Cookies.get("access_token");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/trotro-pay/wallet/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setWallet({ id: data.user_id, balance: data.balance });
        toast.success("Wallet created successfully!");

        // Redirect to fund wallet page
        router.push("/admin/fund");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to create wallet");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Ensure wallet balance is checked only once
  useEffect(() => {
    checkWalletBalance();
  }, []);

  const [fullName, setFullName] = useState("");

  // Fetch full name from localStorage when component mounts
  useEffect(() => {
    const storedName = localStorage.getItem("user");
    if (storedName) {
      const user = JSON.parse(storedName);
      setFullName(user.full_name); // Update state with full name
    }
  }, []);

  return (
    <main className="p-6">
      <ToastContainer/>
      <h2 className="mb-6 text-2xl font-semibold text-[#B4257A]">Dashboard</h2>

      <div className="mb-8 flex items-center justify-between">
        <Button
          className="bg-[#B4257A] text-white"
          onClick={createWallet}
          disabled={!!wallet || loading}
        >
          {loading ? "Creating..." : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Wallet
            </>
          )}
        </Button>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="col-span-2">
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#B4257A] p-2">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg text-muted-foreground">0241234567</span>
            </div>
            <div className="text-4xl font-bold">{wallet ? `GH₵ ${wallet.balance}` : "No wallet available"}</div>
            <div className="text-[#B4257A]">{fullName || "User"}</div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-4">
          <Button className="flex h-auto flex-col items-center justify-center gap-2 bg-white p-6 text-[#B4257A] hover:bg-white/90">
            <Send className="h-10 w-10" />
            <span>PAY</span>
          </Button>
          <Button className="flex h-auto flex-col items-center justify-center gap-2 bg-white p-6 text-[#B4257A] hover:bg-white/90"
          onClick={() => router.push("/admin/deposit")}>
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
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div className="text-right">
                    <div className={`font-medium ${transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}`}>
                      {transaction.amount.startsWith("-") ? transaction.amount : `+GH₵ ${transaction.amount}`}
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
