'use client'
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {Database, Employee, getAllEmployees, getSupabaseBrowserClient, SupabaseClient} from "@/lib/database";

export default function TableDemo() {
    const [employee, setEmployee] = useState<Employee[]>();
    const [loading, setLoading] = useState(true);
    const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchTable = async () => {
            try {
                setLoading(true)
                const Employees = await getAllEmployees(supabase);
                if (Employees) setEmployee(Employees)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchTable();
    }, [supabase]);
    return (
        <Table>
            <TableCaption>{loading ? 'Loading...': 'A list of Employees.'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>EmployeeNumber</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {employee && employee.map((employee) => (
                    <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.Name}</TableCell>
                        <TableCell>{employee.EmployeeNumber}</TableCell>
                        <TableCell>{employee.Role}</TableCell>
                        <TableCell className="text-right">{employee.Email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
