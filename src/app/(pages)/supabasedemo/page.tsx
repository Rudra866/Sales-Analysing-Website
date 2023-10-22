'use client'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
// import supabase from "@/lib/supabase";
import {useEffect, useState} from "react";
import {Database, Tables} from "@/lib/database.types";
import {DbResult} from "@/lib/types";
// import {useSupabase} from "@/components/providers";
import Login from "@/components/auth-components/login";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";

export default function TableDemo() {
    const [sales, setSales] = useState<Tables<'Sales'>[]>();
    const [loading, setLoading] = useState(true);
    // const supabase = useSupabase()
    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        fetchTable();
    }, []);

    const fetchTable = async () => {
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
        <div className="flex flex-col p-4">
            <Login/>
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
