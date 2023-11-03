"use client"
import {useContext} from 'react'
import {AuthContext} from "@/components/auth-provider";
import {
  AuthResponse,
  AuthTokenResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User
} from "@supabase/supabase-js";
import {Employee, Role} from "@/lib/database";

export type AuthContextType = {
  signUp: (data: SignUpWithPasswordCredentials) =>  Promise<AuthResponse>;
  signIn: (data: SignInWithPasswordCredentials) =>  Promise<AuthTokenResponse>;
  signOut: () => Promise<any>;
  user: User | null;
  employee: Employee | null;
  role: Role | null;
};

/**
 * Hook to access user/employee/role variables and authentication functions.
 * This can be used for conditional rendering to personalize the website for the employee, or block rendering
 * buttons that are unusable (but still protected). This CANNOT be used solely for securing routes or actions that could
 * easily be bypassed, use middleware or server routes instead for these actions.
 * If there is no session currently, `user`, `employee` and `role` will all be null.
 *  @returns {AuthContextType}
 *  An object containing the following properties:
 *  - `user`: The user authentication object.
 *  - `employee`: The employee object.
 *  - `role`: The role object of the employee.
 *  - `signIn`: Function for signing in.
 *  - `signOut`: Function for signing out.
 *  - `signUp`: Function for signing up.
 *  @group React Hook
 */
export default function useAuth(): AuthContextType {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return auth;
};
