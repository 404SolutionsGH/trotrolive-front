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
      const response = await fetch("https://api.trotro.live/trotro-pay/preload-wallet/", {
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
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            unoptimized={true}
            width={120}
            height={120}
            className="animate-bounce"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-pink-500">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Oops! Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          {`The page you are looking for doesn't exist or has been moved.
          Our trotro seems to have taken a wrong turn!`}
        </p>
        
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg shadow-lg">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}