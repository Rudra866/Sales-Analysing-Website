// DataContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
// import supabase from './supabaseClient';
import {addDays, format} from "date-fns";
import {DateRange} from "react-day-picker";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {Database, Tables} from "@/lib/database.types";
import {DbResult} from "@/lib/types";


// Define the shape of your context
interface DataContextProps {
    data?: Tables<'MonthlySales'>[];
}

// Create the context with a default undefined value
export const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
    children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2023, 0, 20), 20),
    })
    const supabase = createClientComponentClient<Database>()
    const [data, setData] = useState<Tables<'MonthlySales'>[]>();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('MonthlySales')
                .select('TimePeriod, Total')
                .order('TimePeriod', { ascending: true })
                .filter('TimePeriod', 'gte', format(date?.from || new Date(), 'yyyy-MM-dd'))
                .filter('TimePeriod', 'lte', format(date?.to || new Date(), 'yyyy-MM-dd'))

            if (error) {
                console.error(error);
                return;
            }

            setData(data as DbResult<typeof data[]>);
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{ data }}>
            {children}
        </DataContext.Provider>
    );
};
