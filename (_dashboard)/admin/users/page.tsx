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