"use client"

import { Bell } from 'lucide-react'
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function Header() {

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
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D3748]">Hello, {fullName || "User"}</h1>
        <p className="text-muted-foreground">Welcome back</p>
      </div>
      <Button variant="outline" className="relative justify-start w-[15%] rounded-full">
        <Bell className="h-5 w-5" />
        <span className="text-sm">Notifications</span>
        <div className='justify-end'>
          <Badge className="absolute right-5 top-2 h-5 w-5 rounded-full bg-[#B4257A] pl-1.5 text-white">5</Badge>
        </div>
      </Button>
    </header>
  )
}
