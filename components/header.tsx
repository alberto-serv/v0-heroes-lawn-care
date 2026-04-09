"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    console.log("[v0] Logo clicked, current pathname:", pathname)
    console.log("[v0] Attempting to navigate to homepage")
    e.preventDefault()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-center">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Image src="/images/heroes-logo.png" alt="Heroes Lawn Care" width={120} height={40} className="h-10 w-auto" />
        </Link>
      </div>
    </header>
  )
}
