"use client";
import useAuth from "@/hooks/use-auth";
import { DashboardProvider } from "@/admin/dashboard/components/dashboard-provider";
import { EmployeeProvider } from "@/employee/employee-components/employee-provider";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

// temp TODO -- do this properly with components rather than pages..
const DashboardPage = dynamic(() => import("@/admin/dashboard/page"));
const EmployeePage = dynamic(() => import("@/employee/page"));

/**
 * The root page of the app. Loads employee/admin specific dashboard.
 * @group Next.js Pages
 * @route `/`
 */
export default function RootPage() {
  const { role } = useAuth();

  if (!role) {
    // loading / corrupt user
    return <></>;
  }

  if (role.EmployeePermission) {
    redirect(`/admin`);
  } else {
    redirect(`/employee`);
  }
}

//todo mobile responsiveness , data provider
