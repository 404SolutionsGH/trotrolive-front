'use client';

import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";

export default function SignUpPage() {
  const clientId = process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID;

  if (!clientId) {
    throw new Error("Civic Client ID is not defined in environment variables.");
  }

  return (
    <CivicAuthProvider clientId={clientId}>
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