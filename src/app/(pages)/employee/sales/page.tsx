"use client"
import useAuth from "@/hooks/use-auth";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {Employee, getAllEmployees, getSales, getSupabaseBrowserClient, Sale} from "@/lib/database";
import {errorToast} from "@/lib/toasts";

const SalesTable = dynamic(() => import("@/components/tables/sales-table"))

/**
 * Creates the sales viewing page using a {@link SalesTable} component.
 * @group Next.js Pages
 */
export default function SalesPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [sales, setSales] = useState<Sale[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])

    const supabase = getSupabaseBrowserClient();
    const {employee} = useAuth()

    useEffect(() => {
        setLoading(true);
        getSales()
            .then((sales) => {
                setSales(sales);
            })
            .catch((err) => {
                errorToast("Failed to load sales.")
                console.error(err);
            })

        getAllEmployees(supabase)
            .then(employees => {
                setEmployees(employees)
            })
            .catch((err) => {
                errorToast("Failed to load employees.")
                console.error(err);
            })
        setLoading(false);
    }, [supabase]);

    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sales Table.</h2>
                    <p className="text-muted-foreground">
                        Welcome back, {employee?.Name}
                    </p>
                </div>
            </div>
            <SalesTable data={sales} employees={employees} loading={loading}/>
        </div>
    );
}
