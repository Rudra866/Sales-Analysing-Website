'use client'
import useAuth from "@/hooks/use-auth";
import {DashboardProvider} from "@/admin/dashboard/components/dashboard-provider";
import DashboardPage from "@/admin/dashboard/page";
import {EmployeeProvider} from "@/employee/employee-components/employee-provider";
import EmployeePage from "@/employee/page";

// todo import components instead of entire pages, make them dynamic imports.

/**
 * The root page of the app. Loads employee/admin specific dashboard.
 * @group Next.js Pages
 * @route `/`
 */
export default function RootPage() {
  const {role} = useAuth()

  if (!role) {
    return (
        <>loading</> // todo
    )
  }

  if (role?.EmployeePermission) {
    return (
        <DashboardProvider>
          <DashboardPage/>
        </DashboardProvider>
    )
  } else {
    return (
        <EmployeeProvider>
          <EmployeePage/>
        </EmployeeProvider>
    )
  }
  // return (
  //     <>
  //         <div className="md:hidden">
  //             Old Dashboard
  //         </div>
  //     </>
  // )
}


//todo mobile responsiveness , data provider
