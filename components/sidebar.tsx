"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { CreditCard, HelpCircle, LayoutDashboard, LogOut, Settings, Star } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth-store";

export function Sidebar() {
    const router = useRouter();
    const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const handleLogout = async () => {
        try {
            const logout = useAuthStore.getState().logout;
            logout();
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <div className="hidden w-64 flex-col bg-[#B4257A] text-white rounded-r-lg md:flex">
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-white p-2">
                        <CreditCard className="h-6 w-6 text-[#B4257A]" />
                    </div>
                    <span className="text-xl font-semibold">Trotro</span>
                </div>
                {user && (
                    <div className="mt-4">
                        <div className="font-bold">{user.full_name || "User"}</div>
                        <div className="text-sm">{user.email}</div>
                    </div>
                )}
            </div>
            <nav className="flex-1 space-y-2 py-4">
                <h2 className="mb-6 px-4 text-2xl font-bold">Menu</h2>
                <Link href="/dashboard/admin" className="flex items-center gap-3 rounded-none bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </Link>
                <Link href="/dashboard/admin/role" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <Star className="h-5 w-5" />
                    Role Upgrade
                </Link>
                <Link href="/dashboard/admin/settings" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <Link href="/dashboard/admin/about" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <HelpCircle className="h-5 w-5" />
                    About
                </Link>
            </nav>
            <div className="w-[90%] py-4">
                <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="w-full justify-start gap-2 rounded-l-none rounded-r-md bg-[#CD783F] text-white hover:bg-[#CD783F]/90"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
