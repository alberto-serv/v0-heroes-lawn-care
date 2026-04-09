"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "@/components/ui/navigation-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-center px-4 container">
        <Link href="/" className="flex items-center">
          <Image src="/images/heroes-logo.png" alt="Heroes Lawn Care" width={150} height={50} className="h-10 w-auto" />
        </Link>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
