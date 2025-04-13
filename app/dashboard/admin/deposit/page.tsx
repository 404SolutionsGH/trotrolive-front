"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FundWallet() {

  const [depositAmount, setDepositAmount] = useState("");

  // Deposit into wallet
  const depositToWallet = async () => {
    if (!depositAmount) {
      toast.error("Please enter an amount to deposit.");
      return;
    }

    const token = Cookies.get("access_token");

    try {
      const response = await fetch("http://localhost:8000/trotro-pay/deposit/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: depositAmount }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Deposit: ", data);
        toast.success("Deposit Successful");
        setDepositAmount(""); // Reset deposit input
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to deposit.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="mb-4 text-2xl font-semibold text-[#B4257A]">Deposit Into Wallet</h2>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Enter amount (GHS)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
      </div>

      <Button className="bg-[#B4257A] text-white" onClick={depositToWallet}>
        Deposit
      </Button>
    </div>
  );
}
