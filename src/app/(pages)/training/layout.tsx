'use client'

import { Separator } from "@/components/ui/separator"
import ContainerLayout from "@/components/container-layout";
import {SidebarNav} from "@/admin/settings/components/sidebar-nav";
import React, {useEffect} from "react";
import {getReferencePages, getSupabaseBrowserClient} from "@/lib/database";
import {DbResult} from "@/lib/types";
import useAuth from "@/hooks/use-auth";
import {isAdmin} from "@/lib/utils";
import {ReferenceForm} from "@/app/(pages)/training/reference-form";
import {TrainingSidebarNav} from "@/app/(pages)/training/training-sidebar-nav";

const supabase = getSupabaseBrowserClient();

const sidebarNavItems: { title: string, href: string }[] = []
interface SettingsLayoutProps {children: React.ReactNode}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [pages, setPages] = React.useState();
  const {employee} = useAuth();


  useEffect(() => {
    getReferencePages(supabase)
        .then((pages) => {
            if (employee && isAdmin(employee?.Role)) {
                sidebarNavItems.push({
                    title: 'Create Page',
                    href: '/training/create-new'
                })
            }
            setPages(pages as DbResult<typeof pages>)
            return pages
        }).then((pages) => {
        pages?.forEach((page) => {
            sidebarNavItems.push({
                title: page.pagename,
                href: `/training/${page.id}`,
            })
        })
    })
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
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            {sidebarNavItems && <TrainingSidebarNav items={sidebarNavItems} />}
          </aside>
          <div className="w-full">
              {/*{employee && isAdmin(employee?.Role) && <ReferenceForm />}*/}
              {children}
          </div>
        </div>
      </div>
    </ContainerLayout>
  )
}
