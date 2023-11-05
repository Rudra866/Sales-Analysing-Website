'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {addDays, format, subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {Sale, getSupabaseBrowserClient, Employee, getAllSales, getAllEmployees} from "@/lib/database";
import {DbResult} from "@/lib/types";

export type DataContextProps = {
    data?: Sale[];
    employees?: Employee[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const supabase = getSupabaseBrowserClient()
export const DashboardContext = createContext<DataContextProps | undefined>(undefined);

export function useDashboard(): DataContextProps {
    const context = React.useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
    return context;
}

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({children}) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 120),
        to: new Date(),
    })

    const [data, setData] = useState<Sale[]>();
    const [employees, setEmployees] = useState<Employee[]>();


    useEffect(() => {


        getAllSales(supabase).then((res) => {
            const sales = res && res.length > 0 ? res : []
            setData(filterSalesByDate(sales, date) as Sale[])
            return res
        }).then((res) => {
            console.log('filtered sales: ', res)
        }).catch((err) => {
            console.error(err)
        })

        getAllEmployees(supabase).then((res) => {
            setEmployees(res as Employee[])
            return res
        }).then((res) => {
            console.log('employees: ', res)
        }).catch((err) => {
            console.error(err)
        })

        function filterSalesByDate(sales: Sale[], date: DateRange | undefined) {
            return sales.filter((sale) => {
                const saleDate = new Date(sale?.SaleTime?.toString() || '')
                if (date?.from === undefined || date?.to === undefined) return false
                return saleDate >= date?.from && saleDate <= date?.to
            })
        }


    }, [date]); // todo on every date change, it should not pull data form the db, only filter the data that is already in state.

    return (
        <DashboardContext.Provider value={{data, employees, date, setDate}}>
            {children}
        </DashboardContext.Provider>
    );
};
