"use client"

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { NotificationButton } from "./notifications";

interface User {
  user: any; 
  full_name?: string;
}

export function Header() {
  const user = useAuthStore((state: User) => state.user);
  const fullName = user?.full_name || "User";

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D3748]">Hello, {fullName}</h1>
        <p className="text-muted-foreground">Welcome back</p>
      </div>
      <div className="flex items-center space-x-4">
        <NotificationButton />
      </div>
    </header>
  )
}
