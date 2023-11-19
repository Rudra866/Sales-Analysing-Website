"use client"
// import EmployeeTable from "@/components/EmployeeTable";
import React from "react";
import useAuth from "@/hooks/use-auth";
import dynamic from "next/dynamic";

const EmployeeTable = dynamic(() => import("@/components/tables/EmployeeTable"))

/**
 * Dashboard page that displays an EmployeeTable component.
 * @group Next.js Pages
 * @route `/admin/employees`
 */
export default function EmployeeManagementPage() {
  const {user, isLoading} = useAuth()
    return (
        <>
          <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
              <EmployeeTable/>
          </div>
        </>
    );
}


