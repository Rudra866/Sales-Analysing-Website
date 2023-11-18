'use client'
import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {
    Employee,
    getAllEmployees,
    getAllSales,
    getAllSalesGoals,
    getSupabaseBrowserClient,
    Sale,
    SalesGoal
} from "@/lib/database";
import {DbResult, SaleWithEmployeeAndFinancingType} from "@/lib/types";
import useAuth from "@/hooks/use-auth";

export type DataContextProps = {
    saleWithEmployeeAndFinancing?: SaleWithEmployeeAndFinancingType[];
    mySales?: SaleWithEmployeeAndFinancingType[];
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

    const {
        employee,
        user,
        role
    } = useAuth()
    const [data, setData] = useState<Sale[]>();
    const [employees, setEmployees] = useState<Employee[]>();
    const [saleWithEmployeeAndFinancing, setSaleWithEmployeeAndFinancing] = useState<SaleWithEmployeeAndFinancingType[]>();
    const [salesGoal, setSalesGoal] = useState<SalesGoal[]>();
    const [mySales, setMySales] = useState<SaleWithEmployeeAndFinancingType[]>();

    useEffect(() => {

        getAllSales(supabase).then((res) => {
            const sales = res && res.length > 0 ? res : []
            setData(filterSalesByDate(sales, date) as Sale[])
        })

        getAllEmployees(supabase).then((res) => {
            setEmployees(res as Employee[])
        })

        getAllSalesGoals(supabase).then((res) => {
            setSalesGoal(res as SalesGoal[])
        })

        async function getEmployeeSales() {
            const { data: sales, error } = await supabase
                .from('Sales')
                .select(`
                    EmployeeID,
                    Employees (
                        Avatar,
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
                // .range(0, 100)
                setSaleWithEmployeeAndFinancing(sales as DbResult<typeof sales>[])
                setMySales(filterSalesByEmployee(sales as DbResult<typeof sales>[], employee as Employee) as DbResult<typeof sales>[])

            if (error) throw error;
            return sales;
        }
        getEmployeeSales()
        function filterSalesByDate(sales: Sale[], date: DateRange | undefined) {
            return sales.filter((sale) => {
                const saleDate = new Date(sale?.SaleTime?.toString() || '')
                if (date?.from === undefined || date?.to === undefined) return false
                return saleDate >= date?.from && saleDate <= date?.to
            })
        }

        function filterSalesByEmployee(sales: SaleWithEmployeeAndFinancingType[], employee: Employee | undefined) {
            // console.log('employee', employee, 'sales: ', sales)
            return sales.filter((sale) => {
                return sale.EmployeeID === employee?.id
            })
        }



    }, [date]); // todo on every date change, it should not pull data form the db, only filter the data that is already in state.

    return (
        <DashboardContext.Provider value={{data, employees, date, saleWithEmployeeAndFinancing, mySales, setDate}}>
            {children}
        </DashboardContext.Provider>
    );
};
