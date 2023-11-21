"use client"

import useAuth from "@/hooks/use-auth";
import {Suspense, useEffect, useState} from "react";
import SalesGoalTable from "@/components/tables/sales-goal-table";
import {
  Employee,
  getAllEmployees,
  getAllMonthlySales,
  getSupabaseBrowserClient,
  MonthlySale,
  SalesGoal
} from "@/lib/database";
import {errorToast} from "@/lib/toasts";
export default function SalesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [goals, setGoals] = useState<SalesGoal[]>([])
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const supabase = getSupabaseBrowserClient();
  const {employee} = useAuth()

  // todo clean up this useEffect
  useEffect(() => {
    async function getSalesGoals() {
      try {
        const response = await fetch("/api/goal", {method: "GET"})
        const goals = (await response.json()).data;
        const employees = await getAllEmployees(supabase);
        const monthlySales = await getAllMonthlySales(supabase);
        setMonthlySales(monthlySales);
        setGoals(goals);
        setEmployees(employees);
        setLoading(false);
      } catch (e) {
        errorToast("Failed to get sale goals.");
        console.error(e);
      }
    }
    getSalesGoals()
  }, [supabase]);



  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sales Projections</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {employee?.Name}
                    </p>
                </div>
            </div>
            <SalesGoalTable data={goals} employees={employees} monthlySales={monthlySales} loading={loading} />
        </div>
    </Suspense>
  );
}
