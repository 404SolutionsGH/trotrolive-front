"use client"

import { Bell } from 'lucide-react'
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from "@civic/auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';


export function Header() {
  const [fullName, setFullName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const wallet = useWallet();
  const { user } = useUser()

  useEffect(() => {
    setIsClient(true);
    
    const storedName = localStorage.getItem("user");
    if (storedName) {
      const username = user?.name
      // const userName = user?.username
      setFullName(`${username}`);
    }
  }, [user?.name]);

  const publicKey = isClient ? wallet.publicKey : null;
  const isConnected = isClient && !!publicKey;
  
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D3748]">Hello, {fullName || "User"}</h1>
        <p className="text-muted-foreground">Welcome back</p>
      </div>
      
      <div className="flex items-center gap-4">
        {isConnected ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                User Account
                <span className="text-xs">
                  ({truncateAddress(publicKey?.toString() || "")})
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2 py-16 -mt-10">
                <UserButton />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/" prefetch={true}>
          <Button variant="secondary" size='lg' className="bg-pink-100 text-xl mr-4 text-pink-800 hover:bg-pink-200">
            Connect Wallet
          </Button>
        </Link>
        )}
        
        <Button variant="outline" className="relative justify-start rounded-full">
          <Bell className="h-5 w-5" />
          <span className="text-sm ml-2">Notifications</span>
          <div className='justify-end'>
            <Badge className="absolute right-2 top-2 h-5 w-5 rounded-full bg-[#B4257A] pl-1.5 text-white">5</Badge>
          </div>
        </Button>
      </div>
    </header>
  )
}






// "use client"

// import { Bell } from 'lucide-react'
// import { useEffect, useState } from "react";
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// export function Header() {

//   const [fullName, setFullName] = useState("");

//   // Fetch full name from localStorage when component mounts
//   useEffect(() => {
//     const storedName = localStorage.getItem("user");
//     if (storedName) {
//       const user = JSON.parse(storedName);
//       setFullName(user.full_name); // Update state with full name
//     }
//   }, []);

//   return (
//     <header className="flex items-center justify-between bg-white p-4 shadow-sm">
//       <div>
//         <h1 className="text-2xl font-semibold text-[#2D3748]">Hello, {fullName || "User"}</h1>
//         <p className="text-muted-foreground">Welcome back</p>
//       </div>
//       <Button variant="outline" className="relative justify-start w-[15%] rounded-full">
//         <Bell className="h-5 w-5" />
//         <span className="text-sm">Notifications</span>
//         <div className='justify-end'>
//           <Badge className="absolute right-5 top-2 h-5 w-5 rounded-full bg-[#B4257A] pl-1.5 text-white">5</Badge>
//         </div>
//       </Button>
//     </header>
//   )
// }
