'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {addDays, format} from "date-fns";
import {DateRange} from "react-day-picker";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database, Tables} from "@/lib/database.types";
import {DbResult} from "@/lib/types";



export type DataContextProps = {
    data?: Tables<'Sales'>[];
    employees?: Tables<'Employees'>[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const supabase = createClientComponentClient<Database>()
export const DashboardContext = createContext<DataContextProps | undefined>(undefined);

export function useDashboard(): DataContextProps {
    const context = React.useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
    return context;
}

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
    })

    const [data, setData] = useState<Tables<'Sales'>[]>();
    const [employees, setEmployees] = useState<Tables<'Employees'>[]>();
    // const [monthlySales, setMonthlySales] = useState<{ name: string; total: number}[]>();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('Sales')
                .select('SaleTime, Total')
                .order('SaleTime', { ascending: true })
                .filter('SaleTime', 'gte', format(date?.from || new Date(), 'yyyy-MM-dd'))
                .filter('SaleTime', 'lte', format(date?.to || new Date(), 'yyyy-MM-dd'))

            if (error) {
                console.error(error);
                return;
            }

            setData(data as DbResult<typeof data[]>);
        };
        console.log(date?.from, date?.to)
        console.log(data)
        fetchData()


        const fetchEmployees = async () => {
            const { data, error } = await supabase
                .from('Employees')
                .select('id, Name, Email')
                .order('Name', { ascending: true })

            if (error) {
                console.error(error);
                return;
            }

            setEmployees(data as DbResult<typeof data[]>);
        };
        fetchEmployees()

    }, [date?.from, date?.to]);

    return (
        <DashboardContext.Provider value={{ data, employees, date, setDate }}>
            {children}
        </DashboardContext.Provider>
    );
};
