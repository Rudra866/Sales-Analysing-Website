import {DashboardProvider} from "@/app/(pages)/dashboard/components/dashboard-provider";

/**
 * Layout for the Dashboard page. Includes a {@link DashboardProvider} component to pass data to children.
 * @param children
 * @group React Layouts
 */
export default async function DashboardLayout({ children }: {children: React.ReactNode}) {
  return (
    <div className="relative py-10">
      <DashboardProvider>
          {children}
      </DashboardProvider>
    </div>
  )
}
