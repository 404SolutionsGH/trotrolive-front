'use client'

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import image from "../../../public/assets/generated.jpg"

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="relative grid min-h-screen md:grid-cols-2">
        {/* Logo */}
        <div className="absolute left-8 top-8 z-10">
          <h1 className="text-xl font-bold text-white">
            TroTro<span className="text-sm font-normal">live</span>
          </h1>
        </div>

        {/* Image Column */}
        <div className="hidden md:block">
          <Image
            src={image}
            alt="Login visual"
            width={1080}
            height={1080}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Login Form Column */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Login Form */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold tracking-tight">LOG IN</h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input
                    className="flex-1"
                    placeholder="Email or Phone"
                    type="text"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <Input
                    className="flex-1"
                    placeholder="Password"
                    type="password"
                  />
                </div>

                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-purple-700 hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>

                <div className="flex justify-end">
                  <Button
                    className="w-[50%] bg-purple-700 hover:bg-purple-800"
                  >
                    Log In
                  </Button>
                </div>
              </div>
            </div>

            {/* Create Account Link */}
            <div>
              <Link
                href="/sign-up"
                className="inline-flex py-5 items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
