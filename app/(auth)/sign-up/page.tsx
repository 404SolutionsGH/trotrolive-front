'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="grid gap-8 lg:grid-cols-2 items-center justify-items-center">
        <div className="absolute left-8 top-8 z-10">
          <h1 className="text-xl font-bold">
            TroTro<span className="text-sm font-normal">live</span>
          </h1>
        </div>
          {/* Left Column - Sign Up Form */}
          <div className="space-y-6 w-full max-w-md">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight">CREATE ACCOUNT</h1>
            </div>
            <form className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input className="flex-1" id="name" placeholder="Name" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input className="flex-1" id="email" placeholder="Email" type="email" />
                </div>
              </div>
             <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center w-full">
                    <span className="text-gray-500 px-3 py-2 bg-gray-100 rounded-l-md">+233</span>
                    <Input className="flex-1 rounded-none rounded-r-md" id="phone" placeholder="Phone" type="tel" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div className="relative flex-1">
                    <Input
                      className="pr-10"
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      className="absolute inset-y-0 right-0 px-3"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      variant="ghost"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end py-5">
                <Button className="w-[50%] bg-purple-900 hover:bg-purple-800" type="submit">
                    Sign up
                </Button>
              </div>
            </form>
            <div className="flex justify-end">
              <Link
                href="/login"
                className="inline-flex items-center underline text-sm text-gray-600 hover:text-gray-900"
              >
                Already a member?{" "}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="text-center p-5 text-xs text-muted-foreground">
              By signing in you agree to our{" "}
              <Link className="text-purple-900 underline" href="/terms">
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link className="text-purple-900 underline" href="/privacy">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right Column - Alternative Sign Up */}
          <div className="space-y-6 text-center w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>
            <p className="text-center text-sm">Sign up with any of these:</p>
            {/* Add Other SignUp Accounts Like GMAIL, Outlook etc */}
          </div>
        </div>
      </div>
    </div>
  )
}
