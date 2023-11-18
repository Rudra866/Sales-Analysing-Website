import React, {useEffect} from 'react';
import {
    getAllTasksByAssignee,
    getSalesForEmployeeInDateRange,
    getSalesInDateRange,
    getSupabaseBrowserClient,
    Sale,
    Task
} from "@/lib/database";
import {DateRange} from "react-day-picker";
import useAuth from "@/hooks/use-auth";


type EmployeeContextProps = {
    tasks?: Task[];
    sales?: Sale[];
    date?: DateRange;
    setDate?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
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
        from: undefined,
        to: undefined,
    })
    const [tasks, setTasks] = React.useState<Task[]>();
    const [sales, setSales] = React.useState<Sale[]>();
    const {employee} = useAuth()


    useEffect(() => {
        getAllTasksByAssignee(supabase, employee?.id as string)
            .then((res) => {
                setTasks(res as Task[])
            })
        getSalesForEmployeeInDateRange(supabase, employee?.id as string, date?.from as Date, date?.to as Date)
            .then((res) => {
                setSales(res as Sale[])
            })


    }, [date])



    return (
        <div></div>
    );
}

