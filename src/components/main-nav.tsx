'use client'
import Link from "next/link"

import { cn } from "@/lib/utils"
import {usePathname} from "next/navigation";


const examples = [
  'authentication',
  'cards',
  'forms',
  'music',
  'playground',
  'tasks'
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  console.log(pathname)
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
          href='/'
          className={cn("text-sm font-medium text-muted-foreground transition-colors hover:text-primary", pathname === '/' ? "text-primary" : "text-muted-foreground")}
      >
        Dashboard
      </Link>
      {
        examples.map((component, index) => (
            <Link
                key={component + index}
                href={'/' + component}
                className={cn("text-sm font-medium text-muted-foreground transition-colors hover:text-primary", pathname === '/' + component ? "text-primary" : "text-muted-foreground")}
            >
                {component.charAt(0).toUpperCase() + component.slice(1)}
            </Link>
        ))
      }
    </nav>
  )
}
