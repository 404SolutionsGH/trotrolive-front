'use client';

import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";

export default function SignUpPage() {
  return (
    <CivicAuthProvider clientId="25b8534f-65b4-4cd0-8d2c-76ec66b6ddcd">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to TroTroLive</h1>
          <p className="mb-6">Sign up or log in using Civic</p>
          <UserButton />
        </div>
      </div>
    </CivicAuthProvider>
  );
}