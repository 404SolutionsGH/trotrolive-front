"use client";

import { useRouter } from 'next/navigation';
import { CreditCard, HelpCircle, LayoutDashboard, LogOut, Settings, Star } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from '@/app/lib/store/axios';
import Cookies from 'js-cookie';

export function Sidebar() {

    const router = useRouter();


    const handleLogout = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            const refreshToken = Cookies.get('refresh_token');

            const res = await axios.post('/accounts/api/logout/', { refresh_token: refreshToken }, {
              withCredentials: true,
              headers: { 'X-CSRFToken': csrfToken || '' }
            });

            console.log('Logout successful:', res.data);

            // Clear tokens and redirect
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('csrftoken');
            localStorage.removeItem('user');
            router.push('/auth/login');
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
            </div>
            <nav className="flex-1 space-y-2 py-4">
                <h2 className="mb-6 px-4 text-2xl font-bold">Menu</h2>
                <Link href="/admin" className="flex items-center gap-3 rounded-none bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </Link>
                <Link href="/admin/role" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <Star className="h-5 w-5" />
                    Role Upgrade
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <Link href="/admin/about" className="flex items-center gap-3 rounded-none px-4 py-2 text-white transition-colors hover:bg-white/20">
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
