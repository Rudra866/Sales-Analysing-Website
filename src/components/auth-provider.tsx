'use client'
import {SignInWithPasswordCredentials, SignUpWithPasswordCredentials} from "@supabase/supabase-js";
import {createClientComponentClient, User} from "@supabase/auth-helpers-nextjs";
import {Database, Employee, Role} from "@/lib/database.types";
import {createContext, useEffect, useState} from "react";
import {getEmployeeFromAuthUser, getRoleFromEmployee} from "@/lib/dbwrap";

export type AuthContextType = {
  signUp: (data: SignUpWithPasswordCredentials) => Promise<any>;
  signIn: (data: SignInWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  user: User | null;
  employee: Employee | null;
  role: Role | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>()

  // todo add local storage caching?
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const loadEmployeeAndRole = async (user: User) => {
          const employee = await getEmployeeFromAuthUser(supabase, user);
          if (!employee) throw new Error("Failed to get employee from authenticated user."); // this happens with current misconfigured users, shouldn't be possible in the future

          const role = await getRoleFromEmployee(supabase, employee);
          if (!role) throw new Error("Failed to get the role of the current employee.");

          setEmployee(employee);
          setRole(role);
          setLoading(false);
        }

        setLoading(true);
        // get session data if there is an active session
        const {data: {session}} = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) await loadEmployeeAndRole(session.user);

        // subscribe to auth changes.
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setUser(session?.user ?? null);
              if (session) {
                await loadEmployeeAndRole(session.user);
              }
              setLoading(false);
            }
        );

        // cleanup the useEffect hook
        return () => {
          listener?.subscription.unsubscribe();
        };

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