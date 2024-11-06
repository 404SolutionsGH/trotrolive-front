import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Component() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ]

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link href="/" className="flex items-baseline font-semibold">
          TroTro
          <span className="text-xs ml-0.5">live</span>
        </Link>
        <nav className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative py-1 ${
                pathname === item.href
                  ? "before:absolute before:left-0 before:bottom-0 before:w-full before:h-0.5 before:bg-black"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="text-sm relative py-1 group"
        >
          <span>Login/Sign up</span>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
        </Link>
      </div>
    </header>
  )
}
