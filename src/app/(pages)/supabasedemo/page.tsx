'use client'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import supabase from "@/lib/supabase";
import {useEffect, useState} from "react";
import {Tables, SalesType} from "@/lib/database.types";
import {DbResult} from "@/lib/types";


const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export default function TableDemo() {
    const [sales, setSales] = useState<Tables<'Sales'>>();
    const [loading, setLoading] = useState(true);
    // https://supabase.com/dashboard/project/ciguaogfmmnxjxfqpwhp/editor/31053?view=definition

    useEffect(() => {
        fetchWorkouts();
    }, []);

    useEffect(() => {
        console.log(sales)
    }, [sales]);

    const fetchWorkouts = async () => {
        try {
            setLoading(true)

            let { data: Sales, error } = await supabase
                .from('Sales')
                .select('*')
                .order('id', { ascending: true })
                .limit(10)

            if (error) throw error
            if (Sales) setSales( Sales as DbResult<typeof Sales>)

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
                    {/*<TableHead className="w-[100px]">Invoice</TableHead>*/}
                    {/*<TableHead>Status</TableHead>*/}
                    {/*<TableHead>Method</TableHead>*/}
                    {/*<TableHead className="text-right">Amount</TableHead>*/}

                    {/* Table Header to SalesType columns*/}




                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">{invoice.invoice}</TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
