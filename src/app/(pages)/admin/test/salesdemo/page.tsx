'use client'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {Sale, getAllSales, getSupabaseBrowserClient, Database} from "@/lib/database";
import {SupabaseClient} from "@supabase/supabase-js";

export default function TableDemo() {
    const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
    const [sales, setSales] = useState<Sale[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTable = async () => {
            try {
                setLoading(true)
                let Sales = await getAllSales(supabase)
                if (Sales) {
                    setSales(Sales)
                    console.log(Sales)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchTable();
    }, [supabase]);


    return (
        <div className="flex flex-col p-4">
            <Table>
                <TableCaption>{loading ? 'Loading...': 'A list of Car Sales.'}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>StockNumber</TableHead>
                        <TableHead>VehicleMake</TableHead>
                        <TableHead>ActualCashValue</TableHead>
                        <TableHead>GrossProfit</TableHead>
                        <TableHead>FinandInsurance</TableHead>
                        <TableHead>Holdback</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>EmployeeID</TableHead>
                        <TableHead>TradeInId</TableHead>
                        <TableHead>CustomerID</TableHead>
                        <TableHead>FinancingID</TableHead>
                        <TableHead className="text-right">TradeInID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sales && sales.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{sale.StockNumber}</TableCell>
                            <TableCell>{sale.VehicleMake}</TableCell>
                            <TableCell>{sale.ActualCashValue}</TableCell>
                            <TableCell>{sale.GrossProfit}</TableCell>
                            <TableCell>{sale.FinAndInsurance}</TableCell>
                            <TableCell>{sale.Holdback}</TableCell>
                            <TableCell>{sale.Total}</TableCell>
                            <TableCell>{sale.EmployeeID}</TableCell>
                            <TableCell>{sale.CustomerID}</TableCell>
                            <TableCell>{sale.FinancingID}</TableCell>
                            <TableCell className="text-right">{sale.TradeInID}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
