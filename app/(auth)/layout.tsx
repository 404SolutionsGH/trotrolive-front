'use client';

import { CivicAuthProvider, UserButton } from "@civic/auth/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <CivicAuthProvider clientId="25b8534f-65b4-4cd0-8d2c-76ec66b6ddcd">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
          <h1 className="text-lg font-bold">TroTroLive</h1>
          <div>
            {/* User Profile Button */}
            <UserButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </CivicAuthProvider>
  );
}