'use client'

import {Separator} from "@/components/ui/separator"
import ContainerLayout from "@/components/container-layout";
import React, {useEffect} from "react";
import {getReferencePages, getSupabaseBrowserClient} from "@/lib/database";
import {TrainingSidebarNav} from "@/app/(pages)/training/training-sidebar-nav";
import {ScrollArea} from "@/components/ui/scroll-area";

const supabase = getSupabaseBrowserClient();


interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({children}: SettingsLayoutProps) {
    const [sideBarItems, setSideBarItems] = React.useState<{ title: string, href: string }[]>([])
    useEffect(() => {
        const sidebarNavItems: { title: string, href: string }[] = []
        getReferencePages(supabase)
            .then((pages) => {
                pages?.forEach((page) => {
                    sidebarNavItems.push({
                        title: page.pagename,
                        href: `/training/${page.id}`,
                    })
                })
                sidebarNavItems.sort((a, b) => a.title.localeCompare(b.title)) // sort alphabetically
            }).then(() => setSideBarItems(sidebarNavItems))
    }, [])

    return (
        <ContainerLayout>
            <div className="space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Training & Reference</h2>
                    <p className="text-muted-foreground">
                        Employee training and reference materials.
                    </p>
                </div>
                <Separator className="my-6"/>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <ScrollArea className={'h-[400px]'}>
                            {sideBarItems && <TrainingSidebarNav items={sideBarItems}/>}
                        </ScrollArea>
                    </aside>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </ContainerLayout>
    )
}
