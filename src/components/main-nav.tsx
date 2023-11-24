'use client'
import Link from "next/link"

import {cn} from "@/lib/utils"
import {usePathname} from "next/navigation";
import {docsConfig, docsConfigAdmin} from "@/lib/config";
import useAuth from "@/hooks/use-auth";
import {HTMLAttributes} from "react";



export function MainNav({className, ...props}: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const {role} = useAuth()
  const routes = role?.EmployeePermission ? docsConfigAdmin : docsConfig

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}{...props}>
      {
        routes.mainNav.map((item) => (
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
