'use client'
import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {subDays} from "date-fns";
import {DateRange} from "react-day-picker";
import {
    Employee,
    getAllEmployees, getReferencePages,
    getSupabaseBrowserClient, ReferencePage,
    Sale,
    SalesGoal
} from "@/lib/database";
import {SaleWithEmployeeAndFinancingType} from "@/lib/types";
import useAuth from "@/hooks/use-auth";
import {PostgrestError} from "@supabase/supabase-js";
import {filterSalesByDate, filterSalesByEmployee} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";

type DashBoardContextProps = {
    saleWithEmployeeAndFinancing?: SaleWithEmployeeAndFinancingType[];
    mySales?: SaleWithEmployeeAndFinancingType[];
    data?: Sale[];
    salesGoal?: SalesGoal[];
    employees?: Employee[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    referencePage?: ReferencePage[]
}

const supabase = getSupabaseBrowserClient()
export const DashboardContext = createContext<DashBoardContextProps | undefined>(undefined);

export function useDashboard(): DashBoardContextProps {
    const context = React.useContext(DashboardContext);
    if (!context) throw new Error('useDashboard must be used within a DashboardProvider'+ window.location.pathname.toString());
    return context;
}
export const DashboardProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [filteredSales, setFilteredSales] = useState<Sale[]>();
    const [employees, setEmployees] = useState<Employee[]>();
    const [sales, setSales] = useState<Sale[]>([])
    const [saleWithEmployeeAndFinancing, setSaleWithEmployeeAndFinancing] = useState<SaleWithEmployeeAndFinancingType[]>();
    const [salesGoal, setSalesGoal] = useState<SalesGoal[]>();
    const [mySales, setMySales] = useState<SaleWithEmployeeAndFinancingType[]>();
    const [referencePage, setReferencePage] = useState<ReferencePage[]>();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 120),
        to: new Date(),
    })
    const {employee} = useAuth()

    // get all employees && reference pages on page load
    useEffect(() => {
        getAllEmployees(supabase).then((res) => {
            setEmployees(res as Employee[])
        }).catch(err => {
            toast({
                title: "Error",
                description: "Failed to load employees."
            })
            console.error(err);
        })
        getReferencePages(supabase)
            .then((res) => {
                setReferencePage(res as ReferencePage[])
            }).catch(err => {
                toast({
                    title: "Error",
                    description: "Failed to load reference pages."
                })
            console.error(err);
        })
    }, []);

    // update filtered sales on date change
    useEffect(() => {
        setFilteredSales(filterSalesByDate(date, sales))
    }, [date, sales]);


    useEffect(() => {
        async function getAllSales() {
            const response = await fetch(`/api/sale`, {
                method: "GET"
            });

            const {data: sales, error}: {data: Sale[], error: PostgrestError} = await response.json()
            if (error) throw error;
            setSales(sales)
        }
        async function getSalesGoals() {
            const response = await fetch(`/api/goal`, {
                method: "GET"
            });

            const {data: goals, error}: {data: SalesGoal[], error: PostgrestError} = await response.json()

            if (error) throw error;
            setSalesGoal(goals);
        }

        async function getEmployeeSales() {
            const salesRequest = await fetch(`/api/sale?type=formatted`, {
                method: "GET"
            })

            const {data: sales, error}: {data: SaleWithEmployeeAndFinancingType[], error: PostgrestError} =
                await salesRequest.json()
            if (error) throw error;

            setSaleWithEmployeeAndFinancing(sales)
            setMySales(filterSalesByEmployee(sales, employee!))
        }

        getAllSales();
        getSalesGoals();
        getEmployeeSales()
    }, [employee]);

    return (
        <DashboardContext.Provider
            value={{data:filteredSales,
                salesGoal,
                employees,
                date,
                saleWithEmployeeAndFinancing,
                mySales,
                setDate,
                referencePage
                }}>
            {children}
        </DashboardContext.Provider>
    );
};
