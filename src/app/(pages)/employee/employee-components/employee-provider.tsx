'use client'

import React, {useEffect, useState} from 'react';
import {
    Employee,
    ReferencePage,
    Sale,
    Task,
    getReferencePages,
    getSupabaseBrowserClient,
} from "@/lib/database";
import {DateRange} from "react-day-picker";
import useAuth from "@/hooks/use-auth";
import {subDays} from "date-fns";
import {filterSalesByDate, filterTasksByStartDate} from "@/lib/utils";
import {errorToast} from "@/lib/toasts";


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

    // when called from a user access level, only returns sales for that user.
    async function getSales(): Promise<Sale[]> {
        const response = await fetch(`/api/sale`, { method: "GET" })
        const responseBody = await response.json()

        if (responseBody.error) throw responseBody.error;
        return responseBody.data;
    }

    // when called from a user access level, only returns tasks for that user.
    async function getTasks(): Promise<Task[]> {
        const response = await fetch(`/api/task`, { method: "GET" })
        const responseBody = await response.json()

        if (responseBody.error) throw responseBody.error;
        return responseBody.data;
    }

    useEffect(() => {
        if (!employee) return // if there's no employee, the page is broken already anyway.
        getTasks()
            .then((res) => {
                setTasks(res as Task[])
            })
            .catch(e => {
                errorToast("Failed to load tasks.")
                console.error(e);
            })
        getSales()
            .then((res) => {
                setSales(res)
            })
            .catch(e => {
                errorToast("Failed to load sales.")
                console.error(e);
            })
        getReferencePages(supabase)
            .then((res) => {
                setReferencePage(res)
            })
            .catch(e => {
                errorToast("Failed to load sales.")
                console.error(e);
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

