import React, {PropsWithChildren} from "react";
import {test_employee_set, test_roles_set, test_sales_set} from "@/stories/test_data";
import {AuthContext} from "@/components/auth-provider";
import {AuthContextType} from "@/hooks/use-auth";



// todo add a fake session / get a real one through api?
export const FakeAuthProvider = ({children}: PropsWithChildren ) => {
  const value = {
      isLoading: false,
      employee: test_employee_set[0],
      user: null,
      role: test_roles_set[1],
      session: null,
      error: null,
    };

  return (
      <AuthContext.Provider value={value as unknown as AuthContextType}>
        {children}
      </AuthContext.Provider>
  );
};