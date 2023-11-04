'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {addDays, format} from "date-fns";
import {DateRange} from "react-day-picker";
import {Sale, getSupabaseBrowserClient} from "@/lib/database";
import {DbResult} from "@/lib/types";

export type DataContextProps = {
    data?: Sale[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}


export const DashboardContext = createContext<DataContextProps | undefined>(undefined);

/**
 * Provides child pages being provided by DashboardProvider the fields within {@link DataContextProps}.
 * @group React Hook
 */
export function useDashboard(): DataContextProps {
    const context = React.useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
    return context;
}

export interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
    const supabase = getSupabaseBrowserClient();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
    })


    const [data, setData] = useState<Sale[]>();
    const [monthlySales, setMonthlySales] =
        useState<{ name: string; total: number}[]>();

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
        fetchData()


    }, [date?.from, date?.to, supabase]);

    return (
        <DashboardContext.Provider value={{ data, date, setDate }}>
            {children}
        </DashboardContext.Provider>
    );
};
