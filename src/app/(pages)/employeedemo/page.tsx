'use client'

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {useEffect, useState} from "react";
import {Database, Tables} from "@/lib/database.types";
import {DbResult} from "@/lib/types";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
// import {useSupabase} from "@/components/providers";

export default function TableDemo() {
    const [employee, setEmployee] = useState<Tables<'Employees'>[]>();
    const [loading, setLoading] = useState(true);
    // const supabase = useSupabase()
    const supabase = createClientComponentClient<Database>()

    useEffect(() => {
        fetchTable();
    }, []);

    const fetchTable = async () => {
        try {
            setLoading(true)

            let { data: Employee, error } = await supabase
                .from('Employees')
                .select('*')


            if (error) console.log(error)
            if (Employee) setEmployee( Employee as DbResult<typeof Employee[]>)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Table>
            <TableCaption>{loading ? 'Loading...': 'A list of Employees.'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>EmployeeNumber</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {employee && employee.map((employee) => (
                    <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.Name}</TableCell>
                        <TableCell>{employee.EmployeeNumber}</TableCell>
                        <TableCell>{employee.Password}</TableCell>
                        <TableCell>{employee.Role}</TableCell>
                        <TableCell className="text-right">{employee.Email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
