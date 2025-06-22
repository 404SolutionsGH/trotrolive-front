/* "use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { UserForm } from "./add/user-form"

export default function AddUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link className="hover:text-foreground" href="#">
            Admin
          </Link>
          {" / "}
          <Link className="text-foreground" href="#">
            Basic User
          </Link>
        </nav>
        <h1 className="text-2xl font-semibold">Add User</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
*/

'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8 flex justify-center">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            unoptimized={true}
            width={120}
            height={120}
            className="animate-bounce"
          />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-pink-500">404</h1>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Oops! Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 text-lg">
          {`The page you are looking for doesn't exist or has been moved.
          Our trotro seems to have taken a wrong turn!`}
        </p>
        
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg shadow-lg">
          <Link href="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}