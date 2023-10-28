import {DashboardProvider} from "@/app/(pages)/dashboard/components/dashboard-provider";

/** @ignore */
interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: ExamplesLayoutProps) {
  return (
    <div className="relative py-10">
      <DashboardProvider>
          {children}
      </DashboardProvider>
    </div>
  )
}
