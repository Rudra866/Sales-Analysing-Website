'use client'
import {createContext, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {Database, Employee, Role,
  getEmployeeFromAuthUser, getRoleFromEmployee, User,
  getSupabaseBrowserClient, SupabaseClient} from "@/lib/database";
import {AuthContextType} from "@/hooks/use-auth";
import {Session} from "@supabase/gotrue-js";
import {AuthError} from "@supabase/supabase-js";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  employee: null,
  role: null,
  isLoading: true,
  error: null,
});



/**
 *
 * @param initialSession
 * @param children
 * @group React Component
 */
export const AuthContextProvider = ({initialSession = null, children}:
  PropsWithChildren<{
    initialSession?: Session | null }
  >) => {
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(initialSession);
  const [error, setError] = useState<AuthError | null>();
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();

  // todo add local storage caching so we don't need to read database each refresh.
  // todo clean up this code
  /* set the session when we get an initial session */
  useEffect(() => {
    if (!session && initialSession) {
      setSession(initialSession)
    }
  }, [session, initialSession])

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const { data: {session}, error} = await supabase.auth.getSession()
      if (mounted) {
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }
        setSession(session);
        updateEmployee(supabase, session!)
        setIsLoading(false);
      }
    }

    getSession();
    return () => {
      mounted = false;
    }
  }, [supabase, supabase.auth]);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
          session &&
          (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')
      ) {
        setSession(session);
        updateEmployee(supabase, session)
      }

      if (event === 'SIGNED_OUT') {
        setSession(null);
        updateEmployee(supabase, null)
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, supabase.auth]);


  async function updateEmployee(supabase: SupabaseClient, session?: Session | null) {
    if (!session) {
      setEmployee(null);
      setRole(null);
      setUser(null)
      return;
    }
    const employee = await getEmployeeFromAuthUser(supabase, session.user)
    if (!employee) throw Error("No employee found but user is signed in.") // todo
    const role = await getRoleFromEmployee(supabase, employee);
    if (!role) throw Error("No role found but employee was found.") // todo error page in prod
    setUser(session.user)
    setEmployee(employee);
    setRole(role);
  }


  // create signUp, signIn, signOut functions
  const value: AuthContextType = useMemo(() =>{
    if (isLoading) {
      return {
        isLoading: true,
        employee: null,
        user: null,
        role: null,
        session: null,
        error: null,
      };
    }

    if (error) {
      return {
        isLoading: false,
        employee: null,
        user: null,
        role: null,
        session: null,
        error,
      };
    }

    return {
      isLoading: false,
      employee,
      user,
      role,
      session,
      error: null,
    } as AuthContextType;
    // signUp: async (data) => await supabase.auth.signUp(data), /* todo custom signup */
    // /* add details about the employee registered as additional data on the user entry to pass to db,
    // then use a postgresql function to create the employee entry. */
    // signOut: async () => await supabase.auth.signOut(),
    // user: user ?? null,
    // employee: employee ?? null,
    // role: role ?? null
  }, [isLoading, error, employee, user, role, session]);

  // use a provider to pass down the value
  return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>;
};