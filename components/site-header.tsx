'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@civic/auth/react";
import { useAuthStore } from "@/lib/auth-store";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function SiteHeader() {
  const [isClient, setIsClient] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const publicKey = useAuthStore((state) => state.publicKey);

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  const handleClickOutside = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full transition-colors duration-300 bg-none"
    >
      <div className={`container flex h-16 items-center justify-between transition-colors duration-300 ${
        scrolled ? 'bg-transparent' : 'bg-white'
      } -ml-1 lg:ml-5`}>
        <div className="flex items-center ml-12 scale-75">
          <Link href="/" prefetch={true} className="font-bold">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              unoptimized={true}
              width={50}
              height={50}
             />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden mx-auto md:flex gap-6">
          <Link href="/" prefetch={true} className="hover:text-primary">
            Home
          </Link>
          <Link href="/#web3" prefetch={false} className="hover:text-primary">
            Web3
          </Link>
          <Link href="/#contact" prefetch={false} className="hover:text-primary">
            Contact us
          </Link>
          <Link href="/about" prefetch={true} className="hover:text-primary">
            Who We Are
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard/admin" prefetch={true} className="hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>

        {/* User Account Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && publicKey ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  User Account
                  <span className="text-xs">
                    ({publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)})
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 py-12">
                  <UserButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login" prefetch={true}>
              <Button variant="secondary" size='lg' className="bg-pink-100 text-xl mr-4 text-pink-800 hover:bg-pink-200">
                Join Us Now
              </Button>
            </Link>
          )}
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            onClick={handleClickOutside}
          />
          <div className="fixed top-16 left-0 right-0 bg-white z-40 p-4 flex flex-col items-center">
            <nav className="flex flex-col items-center gap-4 py-4 w-full">
              <Link 
                href="/" 
                className="hover:text-primary py-2"
                onClick={handleClickOutside}
                prefetch={true}
              >
                Home
              </Link>
              <Link 
                href="/#web3" 
                className="hover:text-primary py-2"
                onClick={handleClickOutside}
                prefetch={false}
              >
                Web3
              </Link>
              <Link 
                href="/#contact" 
                className="hover:text-primary py-2"
                onClick={handleClickOutside}
                prefetch={false}
              >
                Contact us
              </Link>
              <Link 
                href="/about" 
                className="hover:text-primary py-2"
                onClick={handleClickOutside}
                prefetch={true}
              >
                About us
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard/admin" 
                  className="hover:text-primary py-2"
                  onClick={handleClickOutside}
                  prefetch={true}
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}