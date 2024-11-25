"use client";

import Link from "next/link"
// import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Component() {


  return (
    <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            logo
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About us
            </Link>
            <Link href="/services" className="text-sm font-medium">
              Services
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact us
            </Link>
          </nav>
          <Link href="/sign-up">
            <Button variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>
  )
}
