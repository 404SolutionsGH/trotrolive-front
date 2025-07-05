"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "../header";
import { Sidebar } from "../sidebar";
// import { getCookie } from "cookies-next";

interface AuthState { isAuthenticated: boolean; logout: () => void; }

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const logout = useAuthStore((state: AuthState) => state.logout);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  // const router = useRouter();

  // useEffect(() => {
  //   // Check for the presence of the access token
  //   const accessToken = getCookie("access_token");

  //   if (!accessToken) {
  //     // Redirect to login if no token is found
  //     router.push("/auth/login");
  //   }
  // }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="min-h-screen flex-1 overflow-auto">
        <Header />
        {children}
      </div>
    </div>
  );
}
