"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FundWallet() {
  const [amount, setAmount] = useState<string>("");

  const handleFundWallet = async () => {
    const token = Cookies.get("access_token");

    if (!amount || parseFloat(amount) < 50) {
      toast.error("Minimum amount to fund your wallet is 50 GHS.");
      return;
    }

    try {
      const response = await fetch("https://api.trotro.live/trotro-pay/wallet/preload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Payment initialized. Redirecting to Paystack...");
        // Redirect to the authorization URL provided by the backend
        window.location.href = data.authorization_url;
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to initialize payment.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-semibold text-[#B4257A]">Fund Wallet</h2>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Enter amount (GHS)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button className="bg-[#B4257A] text-white" onClick={handleFundWallet}>
        Fund Wallet
      </Button>
    </div>
  );
}
