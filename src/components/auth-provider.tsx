'use client'
import {createContext, useEffect, useState} from "react";
import {Database, Employee, Role,
  getEmployeeFromAuthUser, getRoleFromEmployee, User,
  getSupabaseBrowserClient, SupabaseClient} from "@/lib/database";
import {AuthContextType} from "@/hooks/use-auth";

export const AuthContext = createContext<AuthContextType | null>(null);

/**
 *
 * @param children
 * @group React Component
 */
export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

  // todo add local storage caching?
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // subscribe to auth changes.
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setLoading(true);
              setUser(session?.user ?? null);
              if (session) {
                const employee = await getEmployeeFromAuthUser(supabase, session.user)
                if (!employee) throw Error("No employee found but user is signed in.")
                const role = await getRoleFromEmployee(supabase, employee);
                if (!role) throw Error("No role found but employee was found.")

                setEmployee(employee);
                setRole(role);
              }

              setLoading(false);
            }
        );

        // cleanup the useEffect hook
        return () => listener?.subscription.unsubscribe();
      }

      catch (error) {
        console.error("Error initializing authentication:", error);
      }
    };

    initializeAuth();
  }, [supabase, supabase.auth]);

  // create signUp, signIn, signOut functions
  const value: AuthContextType = {
    signUp: async (data) => await supabase.auth.signUp(data), /* todo custom signup */
    /* add details about the employee registered as additional data on the user entry to pass to db,
    then use a postgresql function to create the employee entry. */
    signIn: async (data) => await supabase.auth.signInWithPassword(data),
    signOut: async () => await supabase.auth.signOut(),
    user: user ?? null,
    employee: employee ?? null,
    role: role ?? null
  };

  // use a provider to pass down the value
  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>);
};