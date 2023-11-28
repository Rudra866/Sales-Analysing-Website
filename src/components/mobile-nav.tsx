"use client"

import * as React from "react"
import Link, {LinkProps} from "next/link"
import {useRouter} from "next/navigation"
import {SidebarOpen} from "lucide-react"
import {cn, isAdmin} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {docsConfig, docsConfigAdmin} from "@/lib/config";
import Image from "next/image";
import useAuth from "@/hooks/use-auth";
import {UserNav} from "@/components/user-nav";

export function MobileNav() {
    const [open, setOpen] = React.useState(false)
    const {role} = useAuth()
    const routes = role && isAdmin(role.id) ? docsConfigAdmin : docsConfig
    return (
        <div className={'flex flex-row justify-between'}>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                    >
                        <SidebarOpen className="h-6 w-6"/>
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">

                    <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
                        <Image src={'/icon.png'} alt={'icon'} width={25} height={25} className={'mr-2'}/>
                    </MobileLink>

                    <ScrollArea className="my-4 pb-10 pl-6">
                        <div className="flex flex-col space-y-3">
                            {routes.mainNav?.map(
                                (item) =>
                                    item.href && (
                                        <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}
                                                    className={'text-lg text-foreground'}>
                                            {item.title}
                                        </MobileLink>
                                    )
                            )}
                        </div>
                    </ScrollArea>

                </SheetContent>
            </Sheet>
        </div>
    )
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
                        href,
                        onOpenChange,
                        className,
                        children,
                        ...props
                    }: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    )
}
