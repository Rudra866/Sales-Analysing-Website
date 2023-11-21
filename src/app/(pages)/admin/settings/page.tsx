'use client'
import { Separator } from "@/components/ui/separator"
import EmployeeTable from "@/components/tables/employee-table";
import {useEffect, useState} from "react";
import {Employee, getAllEmployees, getAllRoles, getSupabaseBrowserClient, Role} from "@/lib/database";
import {errorToast} from "@/lib/toasts";




export default function SettingsPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const supabase
      = getSupabaseBrowserClient();

  useEffect(() => {
    setLoading(true);
    getAllEmployees(supabase)
        .then(employees => setEmployees(employees))
        .catch(err => {
          errorToast("Failed to load Employees")
          console.error(err);
        });

    getAllRoles(supabase)
        .then(roles => setRoles(roles))
        .catch(err => {
          errorToast("Failed to load Roles")
          console.error(err);
        });

    setLoading(false);
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
