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

export default function Admin() {

  const router = useRouter();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const createWallet = async () => {
    const token = Cookies.get('access_token');
    console.log("token", token);

    try {
      const response = await fetch('http://localhost:8000/trotro-pay/wallet/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Wallet Created: ", data);
        setWallet(data.wallet);
        toast.success("Wallet created successfully!");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Failed to create wallet");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    createWallet();
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
        {/* <div>
          <h3 className="text-lg font-semibold">Wallet Information</h3>
          <p className="text-muted-foreground">{wallet ? `GH₵ ${wallet.balance}` : "No wallet available"}</p>
        </div> */}
        <Button className="bg-[#B4257A] text-white" onClick={createWallet}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Wallet
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
          onClick={() => router.push("/admin/fund")}>
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
          {[
            { type: "Paid", location: "Kasoa Old Market - Winneba", amount: "-GH₵ 140" },
            { type: "Paid", location: "Kasoa Old Market - Winneba", amount: "-GH₵ 140" },
            { type: "Paid", location: "Kasoa Old Market - Winneba", amount: "-GH₵ 140" },
            { type: "Received", location: "Via MOMO", amount: "-GH₵ 150" },
            { type: "Received", location: "Via MOMO", amount: "-GH₵ 150" },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between border-t p-4">
              <div className="flex items-start gap-4">
                <div className={`h-2 w-2 translate-y-2 rounded-full ${transaction.type === "Paid" ? "bg-[#B4257A]" : "bg-green-500"}`} />
                <div>
                  <div className="font-medium">{transaction.type}</div>
                  <div className="text-sm text-muted-foreground">{transaction.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="text-right">
                  <div className="font-medium">{transaction.amount}</div>
                  <div className="text-sm text-muted-foreground">10 August 2024</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
