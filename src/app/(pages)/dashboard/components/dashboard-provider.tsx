'use client'

import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database, Tables, Sale} from "@/lib/database.types";
import {getAllEmployees, getAllSales} from "@/lib/dbwrap";


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

export const DashboardProvider: React.FC<DashboardProviderProps> = ({children}) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 120),
        to: new Date(),
    })

    const [data, setData] = useState<Tables<'Sales'>[]>();
    const [employees, setEmployees] = useState<Tables<'Employees'>[]>();


    useEffect(() => {
        getAllSales(supabase).then((res) => {
            const sales = res && res.length > 0 ? res : []
            setData(filterSalesByDate(sales, date) as Tables<'Sales'>[])
            return res
        }).then((res) => {
            console.log('filtered sales: ', res)
        }).catch((err) => {
            console.error(err)
        })

        getAllEmployees(supabase).then((res) => {
            setEmployees(res as Tables<'Employees'>[])
            return res
        }).then((res) => {
            console.log('employees: ', res)
        }).catch((err) => {
            console.error(err)
        })

        function filterSalesByDate(sales: Sale[], date: DateRange | undefined) {
            return sales.filter((sale) => {
                const saleDate = new Date(sale.SaleTime.toString())
                if (date?.from === undefined || date?.to === undefined) return false
                return saleDate >= date?.from && saleDate <= date?.to
            })
        }

        async function getEmployeeSales() {
            const { data, error } = await supabase
                .from('Sales')
                .select(`
                    EmployeeID,
                    Employees (
                        Name,
                        Email,
                        EmployeeNumber,
                        Role
                    ),
                      ActualCashValue,
                      CustomerID,
                      DaysInStock,
                      DealerCost,
                      EmployeeID,
                      FinancingID,
                      FinAndInsurance,
                      GrossProfit,
                      LotPack,
                      NewSale,
                      ROI,
                      SaleTime,
                      StockNumber,
                      Total,
                      TradeInID,
                      VehicleMake
                `)
                .order('EmployeeID').then((res) => {
                    console.log('res: ', res)
                    return res
                })
        }
        getEmployeeSales()

    }, [date]); // todo on every date change, it should not pull data form the db, only filter the data that is already in state.

    return (
        <DashboardContext.Provider value={{data, employees, date, setDate}}>
            {children}
        </DashboardContext.Provider>
    );
};
