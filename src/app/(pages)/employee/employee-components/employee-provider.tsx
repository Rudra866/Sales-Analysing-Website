'use client'

import React, {useEffect} from 'react';
import {
    Employee,
    getAllTasksByAssignee, getReferencePages, getSalesForEmployee,
    getSupabaseBrowserClient, ReferencePage,
    Sale,
    Task
} from "@/lib/database";
import {DateRange} from "react-day-picker";
import useAuth from "@/hooks/use-auth";
import {subDays} from "date-fns";


type EmployeeContextProps = {
    tasks?: Task[];
    sales?: Sale[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
    employee?: Employee | null;
    referencePage?: ReferencePage[]
}

const supabase = getSupabaseBrowserClient()

const EmployeeContext = React.createContext<EmployeeContextProps | undefined>(undefined);

export function useEmployee(): EmployeeContextProps {
    const context = React.useContext(EmployeeContext);
    if (!context) throw new Error('useEmployee must be used within a EmployeeProvider');
    return context;
}

interface EmployeeProviderProps {
    children: React.ReactNode;
}

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({children}) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 120),
        to: new Date(),
    })
    const [tasks, setTasks] = React.useState<Task[]>();
    const [sales, setSales] = React.useState<Sale[]>();
    const [referencePage, setReferencePage] = React.useState<ReferencePage[]>()
    const {employee} = useAuth()

    useEffect(() => {
        if (!employee) return
        getAllTasksByAssignee(supabase, employee?.id)
            .then((res) => {
                setTasks(res as Task[])
            })
        getSalesForEmployee(supabase, employee?.id)
            .then((res) => {
                setSales(res as Sale[])
            })
        getReferencePages(supabase)
            .then((res) => {
            setReferencePage(res as ReferencePage[])
        })

    }, [employee])

    useEffect(() => {
        sales && setSales(filterSalesByDate(sales as Sale[], date) as Sale[])
        tasks && setTasks(filterTasksByStartDate(tasks as Task[], date) as Task[])
    }, [date])

    function filterSalesByDate(sales: Sale[], date: DateRange | undefined) {
        return sales.filter((sale) => {
            const saleDate = new Date(sale?.SaleTime?.toString() || '')
            if (date?.from === undefined || date?.to === undefined) return false
            return saleDate >= date?.from && saleDate <= date?.to
        })
    }

    function filterTasksByStartDate(tasks: Task[], date: DateRange | undefined) {
        return tasks.filter((task) => {
            const taskDate = new Date(task?.StartDate?.toString() || '')
            if (date?.from === undefined || date?.to === undefined) return false
            return taskDate >= date?.from && taskDate <= date?.to
        })
    }
    return (
        <EmployeeContext.Provider value={{tasks, sales, date, setDate, employee, referencePage}}>
            {children}
        </EmployeeContext.Provider>
    );
}

