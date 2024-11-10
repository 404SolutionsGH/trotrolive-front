"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { StationForm } from "./add-station"

export default function AddUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
                Admin
            </Link>
            {' / '}
            <Link href="#" className="hover:text-foreground">
                Stations
            </Link>
            {' / '}
            <span>Stations</span>
        </nav>
        <h1 className="text-2xl font-semibold">Add Station</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <StationForm />
        </CardContent>
      </Card>
    </div>
  )
}
