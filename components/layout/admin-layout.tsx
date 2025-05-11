"use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Header } from "../header";
import { Sidebar } from "../sidebar";
// import { getCookie } from "cookies-next";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
