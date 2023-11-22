"use client"
import React, {Suspense, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Employee, getAllEmployees, getAllRoles, getSupabaseBrowserClient, Role} from "@/lib/database";
import {errorToast} from "@/lib/toasts";

const EmployeeTable = dynamic(() => import("@/components/tables/employee-table"))



/**
 * Dashboard page that displays an EmployeeTable component.
 * @group Next.js Pages
 * @route `/admin/employees`
 */
export default function EmployeeManagementPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roles, setRoles] = useState<Role[]>([])

  const supabase = getSupabaseBrowserClient();
  useEffect(() => {
    setLoading(true);

    Promise.all([
      getAllEmployees(supabase),
      getAllRoles(supabase)
    ])
        .then(([employees, roles]) => {
          setEmployees(employees);
          setRoles(roles);
        })
        .catch(err => {
          errorToast("Failed to load data.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [supabase]);

    return (
        <Suspense>
          <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
              <EmployeeTable data={employees} roles={roles} loading={loading}/>
          </div>
        </Suspense>
    );
}


