/* "use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import VehicleForm from "./add/VehicleForm"

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
            Stations
          </Link>
          {" / "}
          <Link className="text-foreground" href="#">
            Vehicles
          </Link>
        </nav>
        <h1 className="text-2xl font-semibold">Add Vehicle</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <VehicleForm />
        </CardContent>
      </Card>
    </div>
  )
}
*/