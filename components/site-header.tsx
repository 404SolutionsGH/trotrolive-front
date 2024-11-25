import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="w-full bg-white py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-[#0A2342]">
          logo
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-[#0A2342]">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium text-[#0A2342]">
            Services
          </Link>
          <Link href="/contact" className="text-sm font-medium text-[#0A2342]">
            Contact us
          </Link>
          <Link href="/about" className="text-sm font-medium text-[#0A2342]">
            About us
          </Link>
        </nav>
        <Button size="sm" className="bg-[#D6246E] hover:bg-[#B51E5B] text-white">
          Sign up
        </Button>
      </div>
    </header>
  )
}

