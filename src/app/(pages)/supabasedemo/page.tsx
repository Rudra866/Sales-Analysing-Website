'use client'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import supabase from "@/lib/supabase";
import {useEffect, useState} from "react";
import {Tables} from "@/lib/database.types";
import {DbResult} from "@/lib/types";

export default function TableDemo() {
    const [sales, setSales] = useState<Tables<'Sales'>[]>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setLoading(true)

            let { data: Sales, error } = await supabase
                .from('Sales')
                .select('*')
                .order('id', { ascending: true })
                .limit(10)

            if (error) throw error
            if (Sales) setSales( Sales as DbResult<typeof Sales[]>)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Table>
            <TableCaption>{loading ? 'Loading...': 'A list of Car Sales.'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ActualCashValue</TableHead>
                    <TableHead>CustomerID</TableHead>
                    <TableHead>EmployeeID</TableHead>
                    <TableHead>FinancingID</TableHead>
                    <TableHead>FinandInsurance</TableHead>
                    <TableHead>GrossProfit</TableHead>
                    <TableHead>Holdback</TableHead>
                    <TableHead>id</TableHead>
                    <TableHead>StockNumber</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>TradeInId</TableHead>
                    <TableHead className="text-right">VechileMake</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sales && sales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.ActualCashValue}</TableCell>
                        <TableCell>{sale.CustomerID}</TableCell>
                        <TableCell>{sale.EmployeeID}</TableCell>
                        <TableCell>{sale.FinancingID}</TableCell>
                        <TableCell>{sale.FinAndInsurance}</TableCell>
                        <TableCell>{sale.GrossProfit}</TableCell>
                        <TableCell>{sale.Holdback}</TableCell>
                        <TableCell>{sale.id}</TableCell>
                        <TableCell>{sale.StockNumber}</TableCell>
                        <TableCell>{sale.Total}</TableCell>
                        <TableCell>{sale.TradeInID}</TableCell>
                        <TableCell className="text-right">{sale.VehicleMake}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
