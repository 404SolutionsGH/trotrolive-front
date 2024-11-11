"use client"

import { ChevronDown, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Sidebar() {

    const [sidebarOpen, setSidebarOpen] = useState({
        accounts: true,
        admin: true,
        stations: true,
    })

  const pathname = usePathname()

  return (
    <aside className="w-[250px] border-r">
      <nav className="grid gap-1 p-2">
        <div className="grid gap-1">
          <Button
            className="justify-between bg-[#D81B60] text-white hover:bg-[#C2185B]"
            variant="ghost"
            onClick={() => setSidebarOpen({ ...sidebarOpen, accounts: !sidebarOpen.accounts })}
          >
            Accounts
            <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen.accounts ? 'rotate-180' : ''}`} />
          </Button>

          {sidebarOpen.accounts && (
            <>
            <Link href="/admin/users">
            <Button
              className={`justify-between w-full ${
                pathname.startsWith('/users') ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Station Master
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button
              className={`justify-between w-full ${
                pathname.startsWith('/users') ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Basic User
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button
              className={`justify-between w-full ${
                pathname.startsWith('/users') ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Premium User
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          </>
        )}
        </div>

        <div className="grid gap-1">
          <Button
            className="justify-between bg-[#D81B60] text-white hover:bg-[#C2185B]"
            variant="ghost"
            onClick={() => setSidebarOpen({ ...sidebarOpen, admin: !sidebarOpen.admin })}
          >
            Admin
            <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen.admin ? 'rotate-180' : ''}`} />
          </Button>

        {sidebarOpen.admin && (
          <Link href="/admin/theme">
            <Button className="justify-between w-full" variant="ghost">
              Theme
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        )}
        </div>

        <div className="grid gap-1">
          <Button
            className="justify-between bg-[#D81B60] text-white hover:bg-[#C2185B]"
            variant="ghost"
            onClick={() => setSidebarOpen({ ...sidebarOpen, stations: !sidebarOpen.stations })}
          >
            Stations
            <ChevronDown className={`h-4 w-4 transition-transform ${sidebarOpen.stations ? 'rotate-180' : ''}`} />
          </Button>

          {sidebarOpen.stations && (
        <>
          <Link href="/admin/stations">
            <Button
              className={`justify-between w-full ${
                pathname === '/stations' ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Stations
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/routes">
            <Button
              className={`justify-between w-full ${
                pathname === '/routes' ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Routes
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin/vehicles">
            <Button
              className={`justify-between w-full ${
                pathname === '/vehicles' ? 'bg-muted' : ''
              }`}
              variant="ghost"
            >
              Vehicles
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </>
          )}

        </div>
      </nav>
    </aside>
  )
}
