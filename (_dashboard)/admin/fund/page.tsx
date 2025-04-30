/* "use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FundWallet() {
  const [amount, setAmount] = useState<string>("");

  const handleFundWallet = async () => {
    const token = Cookies.get("access_token");

    console.log("Token:", token);

    if (!amount || parseFloat(amount) < 50) {
      toast.error("Minimum amount to fund your wallet is 50 GHS.");
      return;
    }

    console.log("Amount entered:", amount);

    try {
      const response = await fetch("http://localhost:8000/trotro-pay/preload-wallet/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Response data:", data);
        toast.success("Payment initialized");
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
      <ToastContainer />
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
*/
export {};