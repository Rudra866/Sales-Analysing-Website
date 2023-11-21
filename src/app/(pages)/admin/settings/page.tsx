'use client'
import { Separator } from "@/components/ui/separator"
import {useEffect, useState} from "react";
import {Employee, getAllEmployees, getAllRoles, getSupabaseBrowserClient, Role} from "@/lib/database";
import {errorToast} from "@/lib/toasts";
import dynamic from "next/dynamic";


const EmployeeTable = dynamic(() =>
    import("@/components/tables/employee-table"))

export default function SettingsPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const supabase
      = getSupabaseBrowserClient();

  useEffect(() => {
    setLoading(true);
    Promise.all([
        getAllEmployees(supabase),
        getAllRoles(supabase)
    ])
      .then(([employees, roles]) => {
        setEmployees(employees)
        setRoles(roles)
    })
      .catch(err => {
        errorToast("Failed to load data.")
        console.error(err);
      })
        .finally(() => setLoading(false));
  }, [supabase]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h3 className="text-lg font-medium">Employees Table</h3>
        <p className="text-sm text-muted-foreground w-full">
          Find and manage your employees.
        </p>
      </div>
        <Separator />
        <EmployeeTable data={employees} roles={roles} loading={loading}/>
    </div>
  )
}
