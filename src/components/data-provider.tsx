'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {addDays, format} from "date-fns";
import {DateRange} from "react-day-picker";
import {Sale, getSupabaseBrowserClient, Employee} from "@/lib/database";
import {DbResult} from "@/lib/types";


interface DataContextProps {
    sale?: Sale[];
    employees?: Employee[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

// const supabase = createClientComponentClient<Database>()
const supabase = getSupabaseBrowserClient();
export const DataContext = createContext<DataContextProps | undefined>(undefined);

export function useDataProvider(): DataContextProps {
    const context = React.useContext(DataContext);
    if (!context) throw new Error('useDataProvider must be used within a DataProvider');
    return context;
}

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
    })
    // const [data, setData] = useState<Sale[]>();
    const [sale, setSale] = useState<Sale[]>();
    const [employees, setEmployees] = useState<Employee[]>();


    useEffect(() => {

        async function getEmployeeSales() {
            const { data: sales, error } = await supabase
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
                      Financing (
                        Method
                       ),
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
                .order('SaleTime', { ascending: false })
                .range(0, 10)

            if (error) throw error;
            return sales;
        }
        getEmployeeSales()
            .then((res) => {
            const sales = res && res.length > 0 ? res : []
                console.log('1: ',sales)
            setSale(filterSalesByDate(sale as DbResult<Sale[]>, date))
            return res
        })



        function filterSalesByDate(sales: Sale[], date: DateRange | undefined) {
            console.log('2: ',sales)
            return sales.filter((sale) => {
                const saleDate = new Date(sale?.SaleTime?.toString() || '')
                if (date?.from === undefined || date?.to === undefined) return false
                return saleDate >= date?.from && saleDate <= date?.to
            })
        }


    }, [date]);

    return (
        <DataContext.Provider value={{ sale, employees, date, setDate }}>
            {children}
        </DataContext.Provider>
    );
};
