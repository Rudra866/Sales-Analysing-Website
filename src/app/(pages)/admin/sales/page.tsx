"use client"

import useAuth from "@/hooks/use-auth";
import dynamic from "next/dynamic";
import {Suspense} from "react";


const SalesTable = dynamic(() => import("@/components/tables/sales-table"))

/**
 * Creates the sales viewing page using a {@link SalesTable} component.
 * @group Next.js Pages
 */
export default function SalesPage() {
    const {employee} = useAuth()

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="h-full flex-1 flex-col space-y-8 md:p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Sales Table.</h2>
                        <p className="text-muted-foreground">
                            Welcome back, {employee?.Name}
                        </p>
                    </div>
                </div>
                <SalesTable />
            </div>
        </Suspense>
    );
}
