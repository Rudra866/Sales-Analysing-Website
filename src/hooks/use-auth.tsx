"use client"
import {createContext, useContext, useEffect, useState} from 'react'
import {createClientComponentClient, User} from "@supabase/auth-helpers-nextjs";
import {Database, Employee, Role} from "@/lib/database.types";
import {SignInWithPasswordCredentials, SignUpWithPasswordCredentials} from '@supabase/supabase-js';


const AuthContext = createContext<AuthContextType | null>(null);
type AuthContextType = {
  signUp: (data: SignUpWithPasswordCredentials) => Promise<any>;
  signIn: (data: SignInWithPasswordCredentials) => Promise<any>;
  signOut: () => Promise<any>;
  user: User | null;
  employee: Employee | null;
  role: Role | null;
};


export const AuthProvider = ({children}: any) => {
  const [user, setUser] = useState<User | null>();
  const [employee, setEmployee] = useState<Employee | null>();
  const [role, setRole] = useState<Role | null>();
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>()


  // todo add local storage caching?
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // get session data if there is an active session
        const {data: {session}} = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session) {
          const employeeResult = await supabase
              .from("Employees")
              .select("*")
              .eq("AuthUser", session.user.id)
              .single();

          if (employeeResult.data) {
            const roleId = employeeResult.data.Role; // Assuming "Role" is the foreign key field
            const roleResult = await supabase
                .from("Roles")
                .select("*")
                .eq("id", roleId)
                .single();
            setEmployee(employeeResult.data);
            setRole(roleResult.data)
            setLoading(false);
          }
        }

        // listen for changes to auth
        const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              setUser(session?.user ?? null);
              // TODO clean this duplicate
              if (session) {
                const employeeResult = await supabase
                    .from("Employees")
                    .select("*")
                    .eq("AuthUser", session.user.id)
                    .single();

                if (employeeResult.data) {
                  const roleId = employeeResult.data.Role; // Assuming "Role" is the foreign key field
                  const roleResult = await supabase
                      .from("Roles")
                      .select("*")
                      .eq("id", roleId)
                      .single();
                  setEmployee(employeeResult.data);
                  setRole(roleResult.data)
                  setLoading(false);
                }
              } else {
                setUser(null);
                setEmployee(null);
                setRole(null)
              }
              setLoading(false);
            }
        );

        // cleanup the useEffect hook
        return () => {
          listener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing authentication:", error);
      }
    };
    initializeAuth();
  }, [supabase, supabase.auth]);

  // create signUp, signIn, signOut functions
  const value: AuthContextType = {
    signUp: async (data) => await supabase.auth.signUp(data),
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

// export the useAuth hook, use this to access employee/role variables and restrict ability on low security features
// for high security routes use the middleware options or use server component/server action
export const useAuth = (): AuthContextType => {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
};

export default useAuth;
