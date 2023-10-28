"use client"
import EmployeeTable from "@/app/(pages)/admin/employees/components/EmployeeTable";
import React from "react";


/**
 * Dashboard page that displays an EmployeeTable component.
 * @constructor
 */
export default function DashboardPage() {
    return (
        // todo the table disappears for any small update
        <>
          <title>Employee Management</title>
          <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
              <EmployeeTable/>
          </div>
        </>


    );
}


