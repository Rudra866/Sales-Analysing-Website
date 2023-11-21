'use client'
import useAuth from "@/hooks/use-auth";
import {DashboardProvider} from "@/admin/dashboard/components/dashboard-provider";
import {EmployeeProvider} from "@/employee/employee-components/employee-provider";
import dynamic from "next/dynamic";

// temp TODO -- do this properly with components rather than pages..
const DashboardPage = dynamic(() => import('@/admin/dashboard/page'));
const EmployeePage = dynamic(() => import('@/employee/page'));

/**
 * The root page of the app. Loads employee/admin specific dashboard.
 * @group Next.js Pages
 * @route `/`
 */
export default function RootPage() {
  const {role} = useAuth()

  if (!role) {
    return (
        <></> // todo
    )
  }

  if (role?.EmployeePermission) {
    return (
        <DashboardProvider>
          <DashboardPage/>
        </DashboardProvider>
    )
  } else {
    // this causes a refresh on data when leaving the main page..
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
