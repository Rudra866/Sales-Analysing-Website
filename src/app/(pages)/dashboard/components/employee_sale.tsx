import { useEffect, useState } from "react";
import {Employee, getSupabaseBrowserClient, Sale, Tables} from "@/lib/database"; // Adjust the path based on your project structure



interface EmployeeSales {
    employee_id: number;
    name: string;
    sales: Sale[];
}

interface SalesByEmployeeProps {
    employeeId: number;
}

function SalesByEmployee({ employeeId }: SalesByEmployeeProps) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchSalesByEmployee = async () => {
            try {
                setLoading(true);

                let { data, error } = await supabase
                    .from('Employees')
                    .select(
                        'employee_id, name, sales(id, sale_column1, sale_column2, ...)'
                    )
                    .eq('employee_id', employeeId)
                    .single();

                if (error) {
                    console.error("Supabase error:", error);
                    throw error;
                }

                const employeeSales = data as EmployeeSales | null;

                if (!employeeSales) {
                    console.error("Supabase returned null data.");
                    return;
                }

                setSales(employeeSales.sales);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesByEmployee();
    }, [employeeId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (sales.length === 0) {
        return <p>No sales found for this employee.</p>;
    }

    return (
        <div>
            <h2>Sales by Employee</h2>
            <ul>
                {sales.map((sale) => (
                    <li key={sale.id}>
                        Sale ID: {sale.id}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SalesByEmployee;
