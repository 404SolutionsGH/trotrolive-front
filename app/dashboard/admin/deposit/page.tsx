/*"use client";

import { Input } from "@/components/ui/input";

/*export default function FundWallet() {

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