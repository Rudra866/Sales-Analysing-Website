"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"
import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import supabase from "@/lib/supabase";
import { SupabaseClient, Session } from '@supabase/supabase-js';
import {Database} from "@/lib/database.types";

// authorization using cookies.


interface SupabaseContextType {
    supabase: SupabaseClient<Database>;
    session: Session | null;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase(): SupabaseContextType {
    const context = useContext(SupabaseContext);
    if (!context) throw new Error("useSupabase must be used within a SupabaseProvider");
    return context;
}

interface SupabaseProviderProps {
    children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {setSession(session);}
        );
        return () => {authListener?.subscription.unsubscribe()};

    }, [supabase.auth]);

    const contextValue = {supabase, session};

    return (
        <SupabaseContext.Provider value={contextValue}>
            {children}
        </SupabaseContext.Provider>
    );
}


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
    <NextThemesProvider  {...props}>
        <SupabaseProvider>
            {children}
        </SupabaseProvider>
    </NextThemesProvider>
  )
}

// begin
// INSERT INTO public.Employeees (id, Name, EmployeeNumber, Password, Role, Email)
// VALUES (
//     NEW.id
// );
// RETURN NEW;
// end
