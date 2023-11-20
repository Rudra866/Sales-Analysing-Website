'use client'

import React, {useEffect, useState} from 'react';
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
import {filterSalesByDate, filterTasksByStartDate} from "@/lib/utils";


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
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 120),
        to: new Date(),
    })
    const [tasks, setTasks] = useState<Task[]>();
    const [sales, setSales] = useState<Sale[]>();
    const [referencePage, setReferencePage] = useState<ReferencePage[]>()
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
        setSales(sales => filterSalesByDate(date, sales))
        setTasks(tasks => filterTasksByStartDate(tasks, date))
    }, [date])

    return (
        <EmployeeContext.Provider value={{tasks, sales, date, setDate, employee, referencePage}}>
            {children}
        </EmployeeContext.Provider>
    );
}

