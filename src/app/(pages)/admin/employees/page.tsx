'use client'
import React, {useEffect, useState} from "react";
import supabase from "@/lib/supabase";
import { Tables } from "@/lib/database.types"
import EmployeeTable from "@/app/(pages)/admin/employees/components/EmployeeTable";

export interface Employee extends Tables<"Employees"> {}
export interface Role extends Tables<"Roles"> {}


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    function fetchData() {
      return Promise.all([
        supabase.from('Employees').select(),
        supabase.from('Roles').select(),
      ]);
    }
    async function loadData() {
      try {
        setLoading(true);
        const [employeeData, roleData] = await fetchData();
        const { data: employees, count: employeeCount, error: employeeError} = employeeData;
        const { data: roles, count: roleCount, error: roleError } = roleData;

        if (employeeError || roleError) {
          console.error("Supabase error: ", (employeeError ?? roleError));
          throw new Error("Failed to load employee or roles data.");
        }

        setEmployees(employees);
        setRoles(roles);
      } catch (error) {
        console.error(error);
      }
    }
    loadData().then(()=> setLoading(false));
  }, []);

  function updateEmployee(employee:Employee) {
    const originalEmployees = [...employees]
    const updatedEmployees = originalEmployees
        .map((oldEmployee) => oldEmployee.id === employee.id ? employee: oldEmployee)
    setEmployees(updatedEmployees)
  }

  return (
      loading ||
      <EmployeeTable updateEmployee={updateEmployee}
                     employees={employees}
                     roles={roles}
                     />
    );

}
