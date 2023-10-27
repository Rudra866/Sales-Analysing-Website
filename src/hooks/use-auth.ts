"use client"
import {useContext} from 'react'
import {AuthContext, AuthContextType} from "@/components/auth-provider";




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
