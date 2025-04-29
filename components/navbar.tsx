"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Trotro.Live
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/#services" className="text-sm font-medium">
            Services
          </Link>
          <Link href="/#contact" className="text-sm font-medium">
            Contact Us
          </Link>
          <Link href="/about" className="text-sm font-medium">
            Who We Are
          </Link>
        </nav>
        <Link href="/sign-up">
          <Button variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200">
            Join Us
          </Button>
        </Link>
      </div>
    </header>
  );
}
