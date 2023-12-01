import { Separator } from "@/components/ui/separator"
import SidebarNav from "./components/sidebar-nav"
import ContainerLayout from "@/components/container-layout";


const sidebarNavItems = [
  {
    title: "Employee Table",
    href: "/admin/settings",
  },
  {
    title: "Add User",
    href: "/admin/settings/user-settings",
  },
  {
    title: "Update User",
    href: "/admin/settings/user-settings/update",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
      <ContainerLayout>
        <div className="space-y-6 p-4 md:p-10 pb-16 md:block">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
            <aside className="-mx-4 md:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </ContainerLayout>
  )
}
