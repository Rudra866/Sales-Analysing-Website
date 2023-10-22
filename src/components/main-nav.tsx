'use client'
import Link from "next/link"

import { cn } from "@/lib/utils"
import {usePathname} from "next/navigation";
import {docsConfig} from "@/lib/config";



export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}{...props}>
      {
        docsConfig.mainNav.map((item, index) => (
            <Link
                key={item.href}
                href={'' + item.href}
                className={cn("text-sm font-medium text-muted-foreground transition-colors hover:text-primary", pathname === '/' + item.href ? "text-primary" : "text-muted-foreground")}
            >
                {item.title}
            </Link>
        ))
      }
    </nav>
  )
}
