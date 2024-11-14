import { Header } from "../header"
import { Sidebar } from "../sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 overflow-auto">
        <Header />

          {children}

      </div>
    </div>
  )
}
