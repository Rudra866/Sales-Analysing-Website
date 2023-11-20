"use client"

import useAuth from "@/hooks/use-auth";
import {Suspense} from "react";
import SalesGoalTable from "@/components/tables/sales-goal-table";

export default function SalesPage() {
    const {employee} = useAuth()
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Sales Table.</h2>
                        <p className="text-muted-foreground">
                            Welcome back, {employee?.Name}
                        </p>
                    </div>
                </div>
                <SalesGoalTable />
            </div>
        </Suspense>
    );
}
