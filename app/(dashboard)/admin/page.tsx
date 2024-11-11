"use client"

import Link from "next/link"


export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link className="hover:text-foreground" href="#">
            Admin
          </Link>
          {" / "}
        </nav>
        <h1 className="text-2xl font-semibold">Admin</h1>
      </div>
    </div>
  )
}
