import {DashboardProvider} from "./components/dashboard-provider";

/**
 * Layout for the Dashboard page. Includes a {@link DashboardProvider} component to pass data to children.
 * @param children
 * @group React Layouts
 */
export default async function DashboardLayout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <DashboardProvider>
          {children}
      </DashboardProvider>
    </>
  )
}
