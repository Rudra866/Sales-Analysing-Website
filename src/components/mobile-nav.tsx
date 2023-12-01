"use client"

import * as React from "react"
import Link, {LinkProps} from "next/link"
import {useRouter} from "next/navigation"
import {Moon, SidebarOpen, Sun} from "lucide-react"
import {cn, isAdmin} from "@/lib/utils"
import {Icons} from "@/components/icons"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {docsConfig, docsConfigAdmin} from "@/lib/config";
import Image from "next/image";
import useAuth from "@/hooks/use-auth";
import {UserNav} from "@/components/user-nav";
import {Label} from "@/components/ui/label";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useTheme} from "next-themes";

export function MobileNav() {
    const [open, setOpen] = React.useState(false)
    const { setTheme, theme } = useTheme()
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
                <SheetContent side="left" className="pr-0 flex flex-col justify-between">

                    <div>
                        <MobileLink href="/" className="flex items-center border-b pb-1 border-dashed" onOpenChange={setOpen}>
                            <Image src={'/icon.png'} alt={'icon'} width={50} height={50} className={'mr-2'}/>
                            <span className="text-lg font-bold text-foreground">
                                Binary Bandits
                                <p className='text-sm text-muted-foreground font-medium'>Sales Tracker</p>
                            </span>
                        </MobileLink>

                        <ScrollArea className="my-4 pb-10 pl-6">
                            <div className="flex flex-col space-y-3 text-sm h-fit">
                                {routes.mainNav?.map(
                                    (item) =>
                                        item.href && (
                                            <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}
                                                        className={'text-foreground'}>
                                                {item.title}
                                            </MobileLink>
                                        )
                                )}
                                <Label className={'text-foreground h-fit py-1'}>
                                    Sign Out
                                </Label>

                            </div>
                        </ScrollArea>
                    </div>
                    <Label
                        className="flex items-center space-x-2 text-sm text-foreground cursor-pointer"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Change theme</span>
                    </Label>
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
