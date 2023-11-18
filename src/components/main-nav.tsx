'use client'
import Link from "next/link"

import {cn, isAdmin} from "@/lib/utils"
import {usePathname} from "next/navigation";
import {docsConfig, docsConfigAdmin} from "@/lib/config";
import useAuth from "@/hooks/use-auth";



export function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const {role} = useAuth()
  const routes = role && isAdmin(role.id) ? docsConfigAdmin : docsConfig

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}{...props}>
      {
        routes.mainNav.map((item, index) => (
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
